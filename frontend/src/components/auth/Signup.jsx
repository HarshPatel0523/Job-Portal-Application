// @ts-nocheck
import { Link } from "react-router-dom";
import NavBar from "../manual/Navbar"
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { RadioGroup } from "../ui/radio-group"
import { useState } from "react";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constants";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "@/redux/authSlice";
import { Loader2 } from "lucide-react";

const Signup = () => {

  const { loading } = useSelector(store => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [input, setInput] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
    role: "",
    profile: ""
  });

  const handleInputChange = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value
    });
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setInput({
        ...input,
        profile: URL.createObjectURL(file) // Store the file URL for preview
      });
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append("fullName", input.fullName);
    formData.append("email", input.email);
    formData.append("phoneNumber", input.phoneNumber);
    formData.append("password", input.password);
    formData.append("role", input.role);

    if (input.profile) {
      formData.append("profile", input.profile); // Append the profile image
    }

    try {
      dispatch(setLoading(true));
      const res = await axios.post(`${USER_API_END_POINT}/register`, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        },
        withCredentials: true
      })
      if (res.data.success) {
        navigate("/login")
        toast.success(res.data.message)
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
    finally {
      dispatch(setLoading(false));
    }
  }

  return (
    <div className="overflow-hidden">
      <NavBar />
      <div className="flex items-center justify-center max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="w-1/2 border border-gray-200 p-4 my-6 rounded-md">
          <h1 className="font-bold text-xl mb-5">Sign Up</h1>
          <div className="my-2">
            <Label className={undefined}>Full Name</Label>
            <Input type="text" placeholder="Harsh" value={input.fullName} name="fullName" onChange={handleInputChange} className="mt-2 mb-4" />
          </div>
          <div className="my-2">
            <Label className={undefined}>Email</Label>
            <Input type="email" placeholder="harsh@gmail.com" value={input.email} name="email" onChange={handleInputChange} className="mt-2 mb-4" />
          </div>
          <div className="my-2">
            <Label className={undefined}>Phone Number</Label>
            <Input type="number" placeholder="xxxx-yyy-zzz" value={input.phoneNumber} name="phoneNumber" onChange={handleInputChange} className="mt-2 mb-4" />
          </div>
          <div className="my-2">
            <Label className={undefined}>Password</Label>
            <Input type="text" placeholder="xyz@#$12" value={input.password} name="password" onChange={handleInputChange} className="mt-2 mb-4" />
          </div>
          <div className="flex items-center justify-between gap-8">
            <RadioGroup className="flex items-center gap-3 mt-2">
              <div className="flex items-center gap-2">
                <Input type="radio" name="role" value="Student" checked={input.role === "Student"} onChange={handleInputChange} className="cursor-pointer" />
                <Label htmlFor="r1" className={undefined}>Student</Label>
              </div>
              <div className="flex items-center gap-2">
                <Input type="radio" name="role" value="Recruiter" checked={input.role === "Recruiter"} onChange={handleInputChange} className="cursor-pointer" />
                <Label htmlFor="r2" className={undefined}>Recruiter</Label>
              </div>
            </RadioGroup>
            <div className="flex items-center gap-2 mt-2">
              <Label className={undefined}>Profile</Label>
              <Input accept="image/*" type="file" onChange={handleFileChange} className="cursor-pointer" />
            </div>
          </div>
          {
            loading ?
              <Button className="w-full my-4 cursor-pointer" variant={undefined} size={undefined}> <Loader2 className="mr-2 h-4  w-4 animate-spin"/>
                Please wait...
              </Button> :
              <Button type="submit" className="w-full my-4 cursor-pointer" variant={undefined} size={undefined}>Sign Up</Button>
          }
          <span>Already have an account? <Link to="/login" className="text-blue-700">Login</Link></span>
        </form>
      </div>
    </div>
  )
}
export default Signup