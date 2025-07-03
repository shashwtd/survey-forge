import { NextRequest, NextResponse } from "next/server";
import { google } from 'googleapis';
import { createClient } from '@/utils/supabase/server';
import { forms_v1 } from 'googleapis';
import { optimizeForGoogleForms } from "@/services/optimzeSurvey";

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
        const { surveyId } = await request.json();

        if (!surveyId) {
            return NextResponse.json({ error: 'Survey ID is required' }, { status: 400 });
        }

        // Fetch the survey from the database
        const { data: surveyData, error: surveyError } = await supabase
            .from('surveys')
            .select('*')
            .eq('id', surveyId)
            .eq('user_id', session.user.id)
            .single();

        if (surveyError || !surveyData) {
            console.error('Survey error:', surveyError);
            return NextResponse.json({ error: 'Survey not found' }, { status: 404 });
        }

        // Optimize the survey for Google Forms
        const optimizedSurvey = await optimizeForGoogleForms(surveyData.content);

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

        // Create Forms API instance
        const forms = google.forms({ version: 'v1', auth: oauth2Client });
        
        const title = optimizedSurvey.info.title.trim();
        const description = (optimizedSurvey.info.description || '').trim();

        // Create form with only title as required by the API
        const formData = {
            info: {
                title: title
            }
        } as forms_v1.Schema$Form;

        try {
            // Create the form
            const form = await forms.forms.create({
                requestBody: formData
            });

            const formId = form.data.formId;
            if (!formId) {
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
            if (optimizedSurvey.items && optimizedSurvey.items.length > 0) {
                const batchUpdateRequest = {
                    requests: optimizedSurvey.items.map((item, index: number) => ({
                        createItem: {
                            item: item as forms_v1.Schema$Item,
                            location: { index }
                        }
                    }))
                };

                await forms.forms.batchUpdate({
                    formId,
                    requestBody: batchUpdateRequest
                });
            }

            const formUrl = `https://docs.google.com/forms/d/${formId}/edit`;

            return NextResponse.json({
                formId,
                url: formUrl
            });
        } catch (error) {
            // Log detailed API error
            console.error('Google Forms API Error:', {
                error: typeof error === 'object' ? JSON.parse(JSON.stringify(error)) : error,
                errorMessage: error instanceof Error ? error.message : String(error)
            });
            
            return NextResponse.json({
                error: 'Failed to create Google Form',
                details: error instanceof Error ? error.message : String(error)
            }, { status: 400 });
        }
    } catch (error) {
        console.error('Google Forms export error:', error);
        return NextResponse.json(
            { error: 'Failed to export to Google Forms' },
            { status: 500 }
        );
    }
}
