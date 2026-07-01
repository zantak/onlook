'use client';

import { observer } from 'mobx-react-lite';
import { useEditorEngine } from '@/components/store/editor';
import {
    LLMProvider,
    MINIMAX_MODELS,
    type InitialModelPayload
} from '@onlook/models';
import { Button } from '@onlook/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@onlook/ui/dropdown-menu';
import { Icons } from '@onlook/ui/icons';
import { cn } from '@onlook/ui/utils';
import { HoverOnlyTooltip } from '../../../editor-bar/hover-tooltip';

interface ModelOption {
    label: string;
    payload: InitialModelPayload;
}

const MINIMAX_OPTIONS: ModelOption[] = [
    { label: 'Minimax M3', payload: { provider: LLMProvider.MINIMAX, model: MINIMAX_MODELS.MINIMAX_M3 } },
    { label: 'Minimax M2.7', payload: { provider: LLMProvider.MINIMAX, model: MINIMAX_MODELS.MINIMAX_M2_7 } },
];

const isSamePayload = (a: InitialModelPayload, b: InitialModelPayload) =>
    a.provider === b.provider && a.model === b.model;

const shortLabel = (payload: InitialModelPayload): string => {
    if (payload.provider === LLMProvider.MINIMAX) {
        switch (payload.model) {
            case MINIMAX_MODELS.MINIMAX_M3:
                return 'M3';
            case MINIMAX_MODELS.MINIMAX_M2_7:
                return 'M2.7';
        }
    }
    return String(payload.model);
};

export const ModelPicker = observer(() => {
    const editorEngine = useEditorEngine();
    const selected = editorEngine.state.selectedModel;

    const currentLabel = shortLabel(selected);

    return (
        <DropdownMenu>
            <HoverOnlyTooltip
                className='mb-1'
                content={<span>Pick a model</span>}
                side="top"
                hideArrow
            >
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        size="sm"
                        className={cn(
                            'h-8 px-2 text-foreground-onlook group flex items-center gap-1.5',
                        )}
                    >
                        <Icons.ChevronDown
                            className={cn(
                                'w-3.5 h-3.5 text-foreground-tertiary group-hover:text-foreground',
                            )}
                        />
                        <span className="text-xs font-medium">
                            Minimax {currentLabel}
                        </span>
                    </Button>
                </DropdownMenuTrigger>
            </HoverOnlyTooltip>
            <DropdownMenuContent align="start" className="w-44">
                {MINIMAX_OPTIONS.map((option) => (
                    <DropdownMenuItem
                        key={option.payload.model}
                        onClick={() => editorEngine.state.setSelectedModel(option.payload)}
                        className={cn(
                            'flex items-center gap-2 px-3 py-2',
                            isSamePayload(option.payload, selected) && 'bg-background-onlook',
                        )}
                    >
                        <span>{option.label}</span>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
});