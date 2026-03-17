export interface ICustomPanelProps {
    initialName: string;
    onSuccess: (id: number) => void;
}

export interface ICustomPanelFormProps {
    initialName?: string;
    onSuccess?: ((id: number) => void) | undefined;
}