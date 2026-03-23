import {Card, CardContent, Grid, Skeleton, Stack, Box} from "@mui/material";

const UserProfileCardSkeleton = () => {
    return (
        <Card elevation={2}>
            <CardContent>
                <Stack spacing={2}>
                    <Grid container spacing={1}>
                        <Grid size={{xs: 12, md: 6}}>
                            {/* Caption */}
                            <Skeleton variant="text" width={120} height={16} sx={{mb: 1}} />

                            {/* RowDisplay (icon + text) */}
                            <Box sx={{display: "flex", gap: 0.5, alignItems: "center"}}>
                                <Skeleton variant="circular" width={16} height={16} />
                                <Skeleton variant="text" width="70%" height={20} />
                            </Box>
                        </Grid>
                    </Grid>
                </Stack>
            </CardContent>
        </Card>
    );
};

export default UserProfileCardSkeleton;