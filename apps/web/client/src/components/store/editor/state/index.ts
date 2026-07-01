import {
    type BranchTabValue,
    type BrandTabValue,
    ChatType,
    EditorMode,
    type InitialModelPayload,
    InsertMode,
    type LeftPanelTabValue,
    LLMProvider,
    MINIMAX_MODELS,
} from '@onlook/models';
import { debounce } from 'lodash';
import { makeAutoObservable } from 'mobx';

const SELECTED_MODEL_STORAGE_KEY = 'onlook.selectedModel';

const DEFAULT_SELECTED_MODEL: InitialModelPayload = {
    provider: LLMProvider.MINIMAX,
    model: MINIMAX_MODELS.MINIMAX_M2_7,
};

const isInitialModelPayload = (value: unknown): value is InitialModelPayload => {
    if (!value || typeof value !== 'object') return false;
    const candidate = value as Record<string, unknown>;
    if (candidate.provider === LLMProvider.MINIMAX) {
        return Object.values(MINIMAX_MODELS).includes(candidate.model as MINIMAX_MODELS);
    }
    return false;
};

const readStoredSelectedModel = (): InitialModelPayload | null => {
    if (typeof window === 'undefined') return null;
    try {
        const raw = window.localStorage.getItem(SELECTED_MODEL_STORAGE_KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        return isInitialModelPayload(parsed) ? parsed : null;
    } catch {
        return null;
    }
};

export class StateManager {
    private _canvasScrolling = false;
    hotkeysOpen = false;
    publishOpen = false;
    leftPanelLocked = false;
    canvasPanning = false;
    isDragSelecting = false;

    editorMode: EditorMode = EditorMode.DESIGN;
    insertMode: InsertMode | null = null;
    leftPanelTab: LeftPanelTabValue | null = null;
    brandTab: BrandTabValue | null = null;
    branchTab: BranchTabValue | null = null;
    manageBranchId: string | null = null;

    chatMode: ChatType = ChatType.EDIT;

    private _selectedModel: InitialModelPayload | null = null;

    constructor() {
        makeAutoObservable(this);
    }

    set canvasScrolling(value: boolean) {
        this._canvasScrolling = value;
        this.resetCanvasScrolling();
    }

    get shouldHideOverlay() {
        return this._canvasScrolling || this.canvasPanning
    }

    get selectedModel(): InitialModelPayload {
        if (this._selectedModel === null) {
            const stored = readStoredSelectedModel();
            this._selectedModel = stored ?? DEFAULT_SELECTED_MODEL;
        }
        return this._selectedModel;
    }

    setSelectedModel(model: InitialModelPayload): void {
        this._selectedModel = model;
        if (typeof window !== 'undefined') {
            try {
                window.localStorage.setItem(SELECTED_MODEL_STORAGE_KEY, JSON.stringify(model));
            } catch {
                // localStorage unavailable; in-memory only.
            }
        }
    }

    private resetCanvasScrolling() {
        this.resetCanvasScrollingDebounced();
    }

    private resetCanvasScrollingDebounced = debounce(() => {
        this.canvasScrolling = false;
    }, 150);

    clear() {
        this.hotkeysOpen = false;
        this.publishOpen = false;
        this.brandTab = null;
        this.branchTab = null;
        this.manageBranchId = null;
        this.resetCanvasScrollingDebounced.cancel();
    }
}