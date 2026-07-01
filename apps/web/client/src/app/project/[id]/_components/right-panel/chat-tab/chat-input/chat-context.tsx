'use client';

import { useEditorEngine } from '@/components/store/editor';
import { MODEL_MAX_TOKENS } from '@onlook/models';
import {
    Context,
    ContextCacheUsage,
    ContextContent,
    ContextContentBody,
    ContextContentFooter,
    ContextContentHeader,
    ContextInputUsage,
    ContextOutputUsage,
    ContextReasoningUsage,
    ContextTrigger
} from '@onlook/ui/ai-elements/context';
import type { LanguageModelUsage } from 'ai';
import { observer } from 'mobx-react-lite';
import { useMemo } from 'react';

export const ChatContextWindow = observer(({ usage }: { usage: LanguageModelUsage }) => {
    const editorEngine = useEditorEngine();
    const showCost = false;
    const maxTokens = MODEL_MAX_TOKENS[editorEngine.state.selectedModel.model];
    const usedTokens = useMemo(() => {
        if (!usage) return 0;
        const input = usage.inputTokens ?? 0;
        const cached = usage.cachedInputTokens ?? 0;
        return input + cached;
    }, [usage]);

    return (
        <Context
            maxTokens={maxTokens}
            usedTokens={usedTokens}
            usage={usage}
        >
            <ContextTrigger />
            <ContextContent>
                <ContextContentHeader />
                <ContextContentBody>
                    <ContextInputUsage />
                    <ContextOutputUsage />
                    <ContextReasoningUsage />
                    <ContextCacheUsage />
                </ContextContentBody>
                {showCost && <ContextContentFooter />}
            </ContextContent>
        </Context>
    );
});