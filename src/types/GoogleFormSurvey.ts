interface GoogleFormsQuestionType {
    title: string;
    questionItem: {
        question: {
            required: boolean;
            textQuestion?: { paragraph: boolean };
            choiceQuestion?: {
                type: "RADIO" | "CHECKBOX" | "DROP_DOWN";
                options: Array<{ value: string }>;
            };
            scaleQuestion?: {
                low: number;
                high: number;
                lowLabel?: string;
                highLabel?: string;
            };
            dateQuestion?: {
                includeTime?: boolean;
                includeYear?: boolean;
            };
            timeQuestion?: {
                duration?: boolean;
            };
        };
    };
}

export type { GoogleFormsQuestionType };

export interface GoogleFormsForm {
    formId?: string;
    info: {
        title: string;
        documentTitle: string;
        description?: string;
    };
    settings: {
        quizSettings?: {
            isQuiz: boolean;
        };
        collectEmail?: boolean;
    };
    items: GoogleFormsItem[];
    revisionId?: string;
    responderUri?: string;
}

export interface GoogleFormsItem {
    itemId?: string;
    title: string;
    description?: string;
    questionItem?: {
        question: {
            required: boolean;
            grading?: {
                pointValue: number;
            };
            textQuestion?: {
                paragraph: boolean;
            };
            choiceQuestion?: {
                type: "RADIO" | "CHECKBOX" | "DROP_DOWN";
                options: Array<{ value: string }>;
                shuffle?: boolean;
            };
            scaleQuestion?: {
                low: number;
                high: number;
                lowLabel?: string;
                highLabel?: string;
            };
            dateQuestion?: {
                includeTime?: boolean;
                includeYear?: boolean;
            };
            timeQuestion?: {
                duration?: boolean;
            };
        };
    };
    questionGroupItem?: {
        questions: GoogleFormsItem[];
        grid?: {
            columns: {
                type: "RADIO" | "CHECKBOX";
                options: Array<{ value: string }>;
            };
        };
    };
    pageBreakItem?: {
        pageNavigationType?: "CONTINUE" | "GO_TO_PAGE" | "RESTART";
    };
}