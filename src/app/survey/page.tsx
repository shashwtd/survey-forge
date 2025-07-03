import { redirect } from 'next/navigation';

export default async function SurveyPage({ 
    searchParams
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const params = await searchParams;
    
    // Filter out undefined values and convert arrays to strings
    const validParams = Object.fromEntries(
        Object.entries(params)
            .filter(([, value]) => value !== undefined)
            .map(([key, value]) => [
                key,
                Array.isArray(value) ? value.join(',') : value
            ])
    ) as Record<string, string>;

    const queryString = new URLSearchParams(validParams).toString();
    redirect(`/survey/create${queryString ? `?${queryString}` : ''}`);
}
