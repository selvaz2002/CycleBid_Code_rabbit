export const getInitials = (string) =>
    string
        .split(/\s+/)
        .map(word => word.charAt(0).toUpperCase())
        .slice(0, 2)
        .join("");