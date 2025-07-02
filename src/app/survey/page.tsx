import { redirect } from 'next/navigation';

export default function SurveyPage({ 
    searchParams
}: {
    searchParams: { [key: string]: string | string[] | undefined }
}) {
    const queryString = new URLSearchParams(searchParams as Record<string, string>).toString();
    redirect(`/survey/create${queryString ? `?${queryString}` : ''}`);
}
