import { registerUser, loginUser } from "../services/auth-service.js";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


export const register = async(req,res)=>{
    try{
        const {username,email, password} = req.body;

        if (!username || !email || !password) {
        return res.status(400).json({
            success: false,
            message: "Username, email and password are required",
        });
        }

        if (username.length < 3) {
        return res.status(400).json({
            success: false,
            message: "Username must be at least 3 characters",
        });
        }

        if (!emailRegex.test(email)) {
        return res.status(400).json({
            success: false,
            message: "Invalid email format",
        });
        }
        const data = await registerUser({ username, email, password });

        res.status(201).json({
            success: true,
            message: "Account created successfully",
            ...data,
        });

    }
    catch(error){
        console.error('Registration error:', error);
        
        if (error.message === "Email already registered") {
            return res.status(400).json({
                success: false,
                message: "Email already registered",
            });
        }
        
        res.status(500).json({
            success: false,
            message: "Registration failed. Please try again.",
        });
    }
}

export const login=async(req,res)=>{
    try{
        const {email, password} = req.body;
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required",
            });
        }

        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: "Invalid email format",
            });
        }

        const data = await loginUser(email, password);

        res.status(200).json({
            success: true,
            message: "Login successful",
            ...data,
        });
    }
    catch(error){
        console.error('Login error:', error);
        
        if (error.message === "Invalid email or password") {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }
        
        res.status(500).json({
            success: false,
            message: "Login failed. Please try again.",
        });
    }
}