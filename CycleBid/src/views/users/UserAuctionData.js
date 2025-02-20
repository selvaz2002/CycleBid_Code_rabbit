import React from 'react'
import {
    Typography,
    Box,
    Button,
    Grid,
} from '@mui/material'
import { Icon } from '@iconify/react'
import CustomAvatar from 'src/@core/components/mui/avatar'
import { useRouter } from 'next/router'

export const UserAuctionData = (props) => {
    const router = useRouter()
    const handleRoutetClick = userId => {
        router.push(`/users/userDetails/${userId}`)
    }
    const { picture, bikeName, bikeModel, bidPrice, bidEndingOn, _id, notifiedMsg } = props;

    return (
        <Grid
            container
            sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: 'center',
                justifyContent: 'center',
                flexWrap: { xs: 'wrap', md: 'nowrap' }
            }}
            onClick={() => handleRoutetClick(_id)}
        >
            {picture ? (
                <Grid
                    item
                    xs={12}
                    sm={2}
                    sx={{
                        mr: { sm: 3 },
                        mb: { xs: 2, sm: 0 },
                        flexBasis: { xs: '100%', sm: 'auto' },
                        textAlign: { xs: 'center', sm: 'left' }
                    }}
                >
                    <img
                        src={picture}
                        alt='product'
                        width={100}
                        height={100}
                        style={{ borderRadius: '10px' }}
                    />
                </Grid>
            ) : (
                <CustomAvatar
                    skin='light'
                    variant='rounded'
                    color='info'
                    sx={{ width: 60, height: 60, fontWeight: 600, mb: 4, fontSize: '1rem' }}
                >
                    {bikeName.slice(0, 2)}
                </CustomAvatar>
            )}

            <Grid
                item
                xs={12}
                sm={4}
                sx={{ flex: 1, ml: { sm: 2 }, mb: { xs: 1, sm: 0 }, textAlign: { xs: 'center', sm: 'left' } }}
            >
                <Typography sx={{ fontSize: { xs: '14px', sm: '15px' }, color: '#292B38', mb: 2 }}>
                    {bikeName}{' '}{bikeModel}
                </Typography>
                <Button
                    sx={{
                        color: '#FFFFFF',
                        backgroundColor: notifiedMsg == 'true' ? '#FC3C53' : '#5B6774',
                        borderRadius: '8px',
                        padding: '8px 16px',
                        textTransform: 'none',
                        '&.MuiButton-root:hover': {
                            backgroundColor: notifiedMsg == 'true' ? '#FC3C53' : '#5B6774',
                            color: '#FFFFFF'
                        },
                        '&:hover': {
                            backgroundColor: notifiedMsg == 'true' ? '#FC3C53' : '#5B6774',
                            color: '#FFFFFF',
                            outline: 'none'
                        },
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 2
                    }}
                >
                    <Typography sx={{ fontSize: '15px', color: 'inherit', whiteSpace: 'nowrap' }}>
                        Bid: {bidPrice}
                    </Typography>
                </Button>
                <Grid
                    container
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: { xs: 'center', sm: 'flex-start' },
                        mb: { xs: 1, sm: 0 },
                        mb: 2
                    }}
                >
                    <Grid item>
                        <Typography
                            sx={{
                                fontSize: '15px',
                                color: notifiedMsg == 'true' ? '#FC3C53' : '#152639',
                                whiteSpace: 'nowrap',
                                mr: 1,
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 0.3
                            }}
                        >
                            Auction End in:
                            <Icon icon='material-symbols-light:pace' width='20' height='20' />
                            {bidEndingOn}
                        </Typography>
                    </Grid>
                </Grid>
            </Grid>

            <Grid
                item
                xs={12}
                sm={3}
                sx={{
                    flex: 1,
                    ml: { sm: 1 },
                    mb: { xs: 2, sm: 0 },
                    textAlign: { xs: 'center', sm: 'left' },
                    mr: { xs: 1, sm: 9 }
                }}
            >
                <Typography sx={{ fontSize: '15px' }}>Bid Ending</Typography>
                <Typography sx={{ fontSize: '15px', fontWeight: 'bold' }}>
                    {bidEndingOn}
                </Typography>
            </Grid>
            <Grid
                item
                xs={12}
                sm={3}
                marginBottom={2}
                sx={{
                    display: 'flex',
                    justifyContent: notifiedMsg == 'true' ? 'space-between' : 'flex-end',
                    alignItems: 'center',
                    flexWrap: 'nowrap'
                }}
            >
                {notifiedMsg == 'true' ? (
                    <>
                        <Button
                            sx={{
                                fontSize: { xs: '12px', sm: '13px', md: '15px' },
                                color: '#1E70EB',
                                border: '1px solid #1E70EB',
                                borderRadius: '8px',
                                textTransform: 'none',
                                width: '88px',
                                height: '38px',
                                padding: 0
                            }}
                            size='medium'
                        >
                            Notify
                        </Button>

                        <i
                            className='ri-arrow-right-s-line'
                            style={{ fontSize: '24px', color: '#000000', flexShrink: 0 }}
                        ></i>
                    </>
                ) : (
                    <>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <i className='ri-star-s-fill' style={{ fontSize: '24px', color: '#FFD700' }}></i>

                            <i
                                className='ri-arrow-right-s-line'
                                style={{ fontSize: '24px', color: '#000000', flexShrink: 0 }}
                            ></i>
                        </Box>
                    </>
                )}
            </Grid>
        </Grid>

    );
}