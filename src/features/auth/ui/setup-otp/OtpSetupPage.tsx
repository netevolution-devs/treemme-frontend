import {Box, Stack} from "@mui/material";
import {useState} from "react";
import {useNavigate} from "react-router";
import BasePage from "@shared/ui/layout/BasePage";
import SetupOtp from "./SetupOtp";
import VerifyDevice from "./VerifyDevice";
import ButtonBackToApp from "@ui/ButtonGoBack";
import {useLayout} from "@ui/layout/default/LayoutContext";

type TSteps = "setupOtp" | "verifyDevice";

const OtpSetupPage = () => {
    const navigate = useNavigate();
    const {setShowTopBar} = useLayout()

    const [step, setStep] = useState<TSteps>("setupOtp");

    const handleOnVerifySuccess = () => {
        navigate("/", {replace: true})
        setShowTopBar(true)
    }

    return (
        <BasePage>
            <Stack
                sx={{
                    p: 8,
                    alignItems: 'center',
                }}
            >
                <Box sx={{alignSelf: 'flex-start', mx: 12}}>
                    <ButtonBackToApp/>
                </Box>
                {step === "setupOtp" && (
                    <SetupOtp
                        onSetupSuccess={() => setStep("verifyDevice")}
                    />
                )}
                {step === "verifyDevice" && (
                    <VerifyDevice
                        onVerifySuccess={handleOnVerifySuccess}
                    />
                )}
            </Stack>
        </BasePage>
    )
}

export default OtpSetupPage;
