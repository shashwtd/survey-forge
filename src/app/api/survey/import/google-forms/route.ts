import { NextRequest, NextResponse } from "next/server";
import { google } from 'googleapis';
import { createClient } from '@/utils/supabase/server';
import { forms_v1 } from 'googleapis';

// Type for the survey data we receive
interface ImportSurveyRequest {
    survey: {
        info: {
            title: string;
            description?: string;
        };
        items: forms_v1.Schema$Item[];
    }
}

export async function POST(request: NextRequest) {
    try {
        // Get Supabase client and session
        const supabase = await createClient();
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError || !session) {
            console.error('Session error:', sessionError);
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Parse and validate request body
        let requestBody;
        try {
            requestBody = await request.json();
            console.log('Received request body:', JSON.stringify(requestBody, null, 2));
        } catch (e) {
            console.error('Failed to parse request body:', e);
            return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
        }

        const { survey } = requestBody as ImportSurveyRequest;
        
        // Detailed survey validation
        if (!survey) {
            console.error('Survey data missing in request');
            return NextResponse.json({ error: 'Survey data required' }, { status: 400 });
        }

        const validationErrors = [];
        if (!survey.info.title) validationErrors.push('title is required');
        if (typeof survey.info.title !== 'string') validationErrors.push('title must be a string');
        if (survey.info.description && typeof survey.info.description !== 'string') validationErrors.push('description must be a string');
        if (!Array.isArray(survey.items)) validationErrors.push('items must be an array');
        
        if (validationErrors.length > 0) {
            console.error('Survey validation errors:', validationErrors);
            return NextResponse.json({ 
                error: 'Invalid survey data', 
                details: validationErrors 
            }, { status: 400 });
        }

        console.log('Survey data validated:', {
            title: survey.info.title,
            description: survey.info.description,
            itemsCount: survey.items?.length,
            items: survey.items.map(item => ({
                type: item.questionItem?.question,
                title: item.title
            }))
        });

        // Get user's Google tokens from database
        const { data: tokens, error: tokensError } = await supabase
            .from('user_google_tokens')
            .select('*')
            .eq('user_id', session.user.id)
            .single();

        if (tokensError || !tokens) {
            console.error('Tokens error:', tokensError);
            return NextResponse.json(
                { error: 'Google account not connected', requiresAuth: true },
                { status: 403 }
            );
        }

        // Initialize Google OAuth2 client
        const oauth2Client = new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            process.env.GOOGLE_REDIRECT_URI
        );

        oauth2Client.setCredentials({
            access_token: tokens.access_token,
            refresh_token: tokens.refresh_token
        });

        console.log('Setting up Google Forms API with tokens:', {
            hasAccessToken: !!tokens.access_token,
            hasRefreshToken: !!tokens.refresh_token,
            tokenExpiresAt: new Date(tokens.expires_at).toISOString()
        });

        // Create Forms API instance
        const forms = google.forms({ version: 'v1', auth: oauth2Client });
        
        // Convert our survey format to Google Forms format
        const title = survey.info.title.trim();
        const description = (survey.info.description || '').trim();

        // Create form with only title as required by the API
        const formData = {
            info: {
                title: title
            }
        } as forms_v1.Schema$Form;

        console.log('Creating form with data:', JSON.stringify(formData, null, 2));

        try {
            // Create the form
            console.log('Calling forms.create API...');
            const form = await forms.forms.create({
                requestBody: formData
            });

            console.log('Form create API response:', JSON.stringify(form.data, null, 2));

            const formId = form.data.formId;
            if (!formId) {
                console.error('No formId in API response:', form.data);
                throw new Error('No form ID returned from Google Forms API');
            }

            // Update form with description and other settings
            if (description) {
                await forms.forms.batchUpdate({
                    formId,
                    requestBody: {
                        requests: [{
                            updateFormInfo: {
                                info: {
                                    description: description
                                },
                                updateMask: 'description'
                            }
                        }]
                    }
                });
            }

            // Add questions to the form if there are any
            if (survey.items && survey.items.length > 0) {
                const batchUpdateRequest = {
                    requests: survey.items.map((item: forms_v1.Schema$Item, index: number) => ({
                        createItem: {
                            item,
                            location: { index }
                        }
                    }))
                };

                console.log('Updating form with questions:', JSON.stringify(batchUpdateRequest, null, 2));

                const updateResponse = await forms.forms.batchUpdate({
                    formId,
                    requestBody: batchUpdateRequest
                });

                console.log('BatchUpdate response:', JSON.stringify(updateResponse.data, null, 2));
            }

            const formUrl = `https://docs.google.com/forms/d/${formId}/edit`;
            console.log('Successfully created form:', { formId, formUrl });

            return NextResponse.json({
                formId,
                url: formUrl
            });
        } catch (error) {
            // Log detailed API error
            console.error('Google Forms API Error:', {
                error: typeof error === 'object' ? JSON.parse(JSON.stringify(error)) : error,
                errorType: error?.constructor?.name,
                errorMessage: error instanceof Error ? error.message : String(error),
                errorStack: error instanceof Error ? error.stack : undefined,
                responseData: error && typeof error === 'object' && 'response' in error ? 
                    (error as unknown as { response: { data: unknown } }).response?.data : undefined
            });
            
            // Return a detailed error response
            return NextResponse.json({
                error: 'Failed to create Google Form',
                details: error instanceof Error ? error.message : String(error)
            }, { status: 400 });
        }
    } catch (error) {
        console.error('Google Forms import error:', error);
        if (error instanceof Error) {
            return NextResponse.json(
                { error: error.message || 'Failed to import to Google Forms' },
                { status: 500 }
            );
        }
        return NextResponse.json(
            { error: 'Failed to import to Google Forms' },
            { status: 500 }
        );
    }
}
