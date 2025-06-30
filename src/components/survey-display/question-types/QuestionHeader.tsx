interface QuestionHeaderProps {
    question: string;
    description?: string;
    required: boolean;
}

export function QuestionHeader({ question, description, required }: QuestionHeaderProps) {
    return (
        <div className="mb-6">
            <h3 className="text-lg font-medium text-white flex items-center gap-2">
                {question}
                {required && (
                    <span className="text-red-500 text-base relative group cursor-help">*
                        <span className="invisible group-hover:visible absolute left-full ml-2 whitespace-nowrap bg-red-500/10 text-red-500 px-2 py-1 rounded text-xs">
                            Required field
                        </span>
                    </span>
                )}
            </h3>
            {description && (
                <p className="text-sm text-white/60 mt-1">{description}</p>
            )}
        </div>
    );
}