import {useEffect, useState} from "react";
import {useParams} from "react-router";
import useGetSubcontractorPdf from "@features/file/subcontractor/api/useGetSubcontractorPdf";
import BasePage from "@shared/ui/layout/BasePage";

const SubcontractorFilePage = () => {
    const {id} = useParams<{id: string}>();
    const {data: blob, isLoading} = useGetSubcontractorPdf(id!);
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);

    useEffect(() => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        setPdfUrl(url);
        return () => URL.revokeObjectURL(url);
    }, [blob]);

    return (
        <BasePage isLoading={isLoading} fullwidth sx={{px: 2, pt: 1, pb: 2}}>
            {pdfUrl && (
                <iframe
                    src={pdfUrl}
                    style={{
                        display: 'block',
                        width: '100%',
                        height: 'calc(100vh - 90px)',
                        border: 'none',
                        borderRadius: '8px',
                        boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
                    }}
                    title="Subcontractor PDF"
                />
            )}
        </BasePage>
    );
};

export default SubcontractorFilePage;
