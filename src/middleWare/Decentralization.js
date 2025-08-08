const Decentralization = (allowedRoles) => {
    return (req, res, next) => {
        try {
            if (!req.cookies.User) {
                return res.status(401).json({ message: "Not logged in" });
            }

            const user = JSON.parse(req.cookies.User);
            const { Role } = user;

            console.log("User role:", Role);

            if (!allowedRoles.includes(Role)) {
                return res.status(403).json({ message: "Forbidden" });
            }

            next();
        } catch (err) {
            return res.status(500).json({ error: err.message });
        }
    };
};

export default Decentralization;
