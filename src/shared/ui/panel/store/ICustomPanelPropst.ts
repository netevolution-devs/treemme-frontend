export interface ICustomPanelProps<TExtra = unknown> {
    initialName: string;
    onSuccess: (id: number) => void;
    extra?: TExtra;
}

export interface ICustomPanelFormProps<TExtra = unknown> {
    initialName?: string;
    onSuccess?: ((id: number) => void) | undefined;
    extra?: TExtra;
}