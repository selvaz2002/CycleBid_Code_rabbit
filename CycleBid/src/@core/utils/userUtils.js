import { getInitials } from "./get-initials";
import CustomAvatar from 'src/@core/components/mui/avatar'

export const capitalizeFirstLetter = (str) => {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const renderClient = row => {
    const Name = row.username || 'A';
    const initials = getInitials(Name);
    const states = ['success', 'error', 'warning', 'info', 'primary', 'secondary']
    const stateNum = Math.floor(Math.random() * 6)
    const color = states[stateNum]

    if (row.profileImage) {
        return <CustomAvatar src={row.profileImage} sx={{ mr: 3, width: '2.5rem', height: '2.5rem' }} />;
    } else {
        return (
            <CustomAvatar skin="light" color={color} sx={{ mr: 3, fontSize: '.8rem', width: '2.5rem', height: '2.5rem' }}>
                {initials}
            </CustomAvatar>
        );
    }
}
