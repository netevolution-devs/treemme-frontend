export interface ICustomPanelProps<TExtra = unknown> {
    initialName: string;
    onSuccess: (id: number) => void;
    extra?: TExtra;
    customId?: string;
}

export interface ICustomPanelFormProps<TExtra = unknown> {
    initialName?: string;
    onSuccess?: ((id: number) => void) | undefined;
    extra?: TExtra;
    customId?: string;
}