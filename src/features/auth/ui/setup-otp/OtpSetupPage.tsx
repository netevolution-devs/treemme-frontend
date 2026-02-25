import {Box} from "@mui/material";
import {useState} from "react";
import {useNavigate} from "react-router";
import BasePage from "@shared/ui/layout/BasePage";
import SetupOtp from "./SetupOtp";
import VerifyDevice from "./VerifyDevice";

type TSteps = "setupOtp" | "verifyDevice";

const OtpSetupPage = () => {
    const navigate = useNavigate();

    const [step, setStep] = useState<TSteps>("setupOtp");

    return (
        <BasePage>
            <Box
                sx={{
                    py: 8,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '99vh',
                }}
            >
                {step === "setupOtp" && (
                    <SetupOtp
                        onSetupSuccess={() => setStep("verifyDevice")}
                    />
                )}
                {step === "verifyDevice" && (
                    <VerifyDevice
                        onVerifySuccess={() => navigate("/", {replace: true})}
                    />
                )}
            </Box>
        </BasePage>
    )
}

export default OtpSetupPage;
