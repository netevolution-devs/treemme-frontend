import {useTranslation} from "react-i18next";
import type {SvgIconComponent} from "@mui/icons-material";
import useGetWhoAmI from "@features/auth/api/useGetWhoAmI";
import {
    Box, Card, CardContent, Chip, Grid, Stack, Typography,
    // Chip, Divider,  Button
} from "@mui/material";
import {
    Email as EmailIcon,
    // Phone as PhoneIcon, Home as HomeIcon, Badge as BadgeIcon, CalendarToday as CalendarIcon, AccountCircle as AccountIcon
} from "@mui/icons-material";
// import dayjs from "dayjs";
// import EditIcon from '@mui/icons-material/Edit';
// import {useRef} from "react";
// import UpdateUserDialog from "@features/user/ui/components/UpdateUserDialog";
// import type {IDialogActions} from "@ui/dialog/IDialogActions";
// import useGetProfile from "@features/profile/api/useGetProfile";
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import {useMemo} from "react";
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

interface GroupRole {
    group: string;
    role: string;
}

interface RowDisplayProps {
    icon: SvgIconComponent;
    text: string | null | undefined;
}

const RowDisplay = ({icon: Icon, text}: RowDisplayProps) => {
    const {t} = useTranslation(["settings"]);

    return (
        <Box sx={{display: 'flex', gap: 0.5, mb: 1.5}}>
            <Icon fontSize="small"/>
            <Typography variant="body2" color="text.secondary" gutterBottom>
                {text || t("settings:profile.not-specified")}
            </Typography>
        </Box>
    )
}

// interface UserProfileCardProps {
//     userCode: string;
// }

const UserProfileCard = (
    // {userCode}: UserProfileCardProps
) => {
    const {t} = useTranslation(["common"]);
    // const {data: user} = useGetProfile(userCode);
    const {data: user} = useGetWhoAmI();

    // const updateUserDialogRef = useRef<IDialogActions>(null);

    const groupRoles = useMemo<GroupRole[]>(() => {
        const accessControl = user?.accessControl;

        if (!accessControl) return [];

        const seen = new Set<string>();

        return accessControl.reduce<GroupRole[]>((acc, x) => {
            const key = `${x.group}|${x.role}`;

            if (!seen.has(key)) {
                seen.add(key);
                acc.push({
                    group: x.group,
                    role: x.role
                });
            }

            return acc;
        }, []);
    }, [user?.accessControl]);

    return (
        <Card variant={"outlined"}>
            {/*<UpdateUserDialog ref={updateUserDialogRef} userCode={user?.userCode as string} isProfile/>*/}
            <CardContent>
                <Stack spacing={2}>
                    {/* Header */}
                    {/*<Box>*/}
                    {/*    <Typography variant="h5" gutterBottom fontWeight={600}>*/}
                    {/*        {user?.name}*/}
                    {/*    </Typography>*/}
                    {/*    <RowDisplay icon={EmailIcon} text={user?.email}/>*/}
                    {/*    <Stack direction="row" spacing={1} flexWrap="wrap">*/}
                    {/*        {user?.roles.map((userRole) => (*/}
                    {/*            <Chip*/}
                    {/*                key={userRole.role.id}*/}
                    {/*                label={userRole.role.name}*/}
                    {/*                size="small"*/}
                    {/*                api="primary"*/}
                    {/*            />*/}
                    {/*        ))}*/}
                    {/*    </Stack>*/}
                    {/*</Box>*/}

                    {/*<Divider/>*/}

                    {/*<Box>*/}
                    {/*    <Button*/}
                    {/*        variant="contained"*/}
                    {/*        sx={{height: 30, px: 1, pl: 0.6}}*/}
                    {/*        onClick={() => openDialog(updateUserDialogRef)}*/}
                    {/*    >*/}
                    {/*        <EditIcon/>*/}
                    {/*        {t("common:edit-profile.button")}*/}
                    {/*    </Button>*/}
                    {/*</Box>*/}

                    {/* All Info in Grid */}
                    <Grid container spacing={1}>
                        <Grid size={{xs: 12, md: 6}}>
                            <Typography variant="caption" color="text.secondary">
                                {t("settings:profile.card.email")}
                            </Typography>
                            <RowDisplay icon={EmailIcon} text={user?.email}/>
                        </Grid>

                        {/*<Grid size={{xs: 12, md: 6}}>*/}
                        {/*    <Typography variant="caption" api="text.secondary">*/}
                        {/*        {t("settings:profile.card.phone")}*/}
                        {/*    </Typography>*/}
                        {/*    <RowDisplay icon={PhoneIcon} text={user?.phone}/>*/}
                        {/*</Grid>*/}

                        {/*<Grid size={{xs: 12, md: 6}}>*/}
                        {/*    <Typography variant="caption" api="text.secondary">*/}
                        {/*        {t("settings:profile.card.fiscal-code")}*/}
                        {/*    </Typography>*/}
                        {/*    <RowDisplay icon={BadgeIcon} text={user?.fiscalCode}/>*/}
                        {/*</Grid>*/}

                        <Grid size={{xs: 12, md: 6}}>
                            <Typography variant="caption" color="text.secondary">
                                {t("settings:profile.card.user-code")}
                            </Typography>
                            <RowDisplay icon={AccountBoxIcon} text={user?.userCode}/>
                        </Grid>

                        <Grid size={{xs: 12, md: 6}}>
                            <Box>
                                <Typography variant="caption" color="text.secondary">
                                    {t("settings:profile.card.access-control")}
                                </Typography>
                            </Box>
                            <Box sx={{display: 'flex', flexWrap: 'wrap', gap: 0.2, mt: 0.5}}>
                                <AdminPanelSettingsIcon/>
                                <Box sx={{display: 'flex', gap: 0.6, flexWrap: 'wrap'}}>
                                    {groupRoles.map((role) => (
                                        <Chip
                                            label={`${role.group} - ${role.role}`}
                                            size={"small"}
                                        />
                                    ))}
                                </Box>
                            </Box>
                        </Grid>

                        {/*<Grid size={12}>*/}
                        {/*    <Typography variant="caption" api="text.secondary">*/}
                        {/*        {t("settings:profile.card.address")}*/}
                        {/*    </Typography>*/}
                        {/*    <RowDisplay icon={HomeIcon} text={user?.address}/>*/}
                        {/*</Grid>*/}

                        {/*<Grid size={12}>*/}
                        {/*    <Typography variant="caption" api="text.secondary">*/}
                        {/*        {t("settings:profile.card.registration-date")}*/}
                        {/*    </Typography>*/}
                        {/*    <RowDisplay icon={CalendarIcon}*/}
                        {/*                text={dayjs(user?.createdAt).format("DD MMMM YYYY [alle] HH:mm")}/>*/}
                        {/*</Grid>*/}
                    </Grid>
                </Stack>
            </CardContent>
        </Card>
    );
};

export default UserProfileCard;
