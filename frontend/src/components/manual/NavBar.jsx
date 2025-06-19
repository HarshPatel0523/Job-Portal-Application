// @ts-nocheck
import { Button } from "../ui/button";
import { Avatar, AvatarImage } from "../ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { User2, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constants";
import { setUser } from "@/redux/authSlice";
import { toast } from "sonner";

const NavBar = () => {
    const { user } = useSelector(store => store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const logoutHandler = async () => {
        try {
            const res = await axios.get(`${USER_API_END_POINT}/logout`, { withCredentials: true });
            if (res.data.success) {
                dispatch(setUser(null));
                navigate("/");
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        }
    }
    return (
        <div className="bg-white">
            <div className="flex justify-between items-center mx-auto max-w-7xl px-4 py-4 h-16">
                <div>
                    <h1 className="text-2xl font-bold">Job <span className="text-[#F83002]">Portal</span></h1>
                </div>
                <div className="flex items-center gap-12">
                    <ul className="flex font-medium items-center gap-6 cursor-pointer">
                        {
                            user && user.role === 'recruiter' ? (
                                <>
                                    <li><Link to="/admin/companies">Companies</Link></li>
                                    <li><Link to="/admin/jobs">Jobs</Link></li>
                                </>
                            ) : (
                                <>
                                    <li><Link to="/">Home</Link></li>
                                    <li><Link to="/jobs">Jobs</Link></li>
                                    <li><Link to="/browse">Browse</Link></li>
                                </>
                            )
                        }
                    </ul>
                    {
                        !user ? (
                            <div className="flex items-center gap-4">
                                <Link to="/login">
                                    <Button variant="outline" size="default" className="cursor-pointer">Login</Button>
                                </Link>
                                <Link to="/signup">
                                    <Button variant="default" size="default" className="bg-[#6A38C2] hover:bg-[#6A38F9] cursor-pointer">Signup</Button>
                                </Link>
                            </div>
                        ) : (
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Avatar className="cursor-pointer">
                                        <AvatarImage className="h-full w-full" src="https://github.com/shadcn.png" alt="@shadcn" />
                                    </Avatar>
                                </PopoverTrigger>
                                <PopoverContent className="w-80">
                                    <div className=''>
                                        <div className='flex gap-2 space-y-2'>
                                            <Avatar className="cursor-pointer">
                                                <AvatarImage src={user?.profile?.profilePhoto || "https://www.shutterstock.com/image-vector/circle-line-simple-design-logo-600nw-2174926871.jpg"} alt={user?.fullname || "User Avatar"} className={undefined} />
                                            </Avatar>
                                            <div>
                                                <h4 className='font-medium pt-1'>{user?.fullName}</h4>
                                                <p className='text-sm'>{user?.profile?.bio}</p>
                                            </div>
                                        </div>
                                        <div className='flex flex-col my-2 text-gray-600'>
                                            {
                                                user && user.role === 'student' && (
                                                    <div className='flex w-fit items-center gap-2 cursor-pointer'>
                                                        <User2 />
                                                        <Button variant="link" className="text-black" size={undefined}> <Link to="/profile">View Profile</Link></Button>
                                                    </div>
                                                )
                                            }

                                            <div className='flex w-fit items-center pl-2 gap-2 cursor-pointer'>
                                                <LogOut />
                                                <Button onClick={logoutHandler} variant className="cursor-pointer" size={undefined}>Logout</Button>
                                            </div>
                                        </div>
                                    </div>
                                </PopoverContent>
                            </Popover>
                        )
                    }
                </div>
            </div>
        </div>
    )
}

export default NavBar