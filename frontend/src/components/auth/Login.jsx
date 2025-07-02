// @ts-nocheck
import { Link, useNavigate } from "react-router-dom";
import NavBar from "../manual/Navbar"
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { RadioGroup } from "../ui/radio-group"
import { useEffect, useState } from "react";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constants";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setUser } from "@/redux/authSlice";
import { Loader2 } from "lucide-react";

const Login = () => {

  const { loading,user } = useSelector(store => store.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [input, setInput] = useState({
    email: "",
    password: "",
    role: ""
  });

  const handleInputChange = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value
    });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Submitting form with input:", input);

    try {
      dispatch(setLoading(true));
      const res = await axios.post(`${USER_API_END_POINT}/login`, input, {
        headers: {
          "Content-Type": "application/json"
        },
        withCredentials: true
      })
      if (res.data.success) { 
        dispatch(setUser(res.data.user));
        toast.success(res.data.message);
        setInput({ email: "", password: "", role: "" });
        navigate("/");
      } else {
        toast.error("Login failed!");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
    finally {
      dispatch(setLoading(false));
    }
  }

  useEffect(()=>{
        if(user){
            navigate("/");
        }
    },[])


  return (
    <div className="overflow-hidden">
      <NavBar />
      <div className="flex items-center justify-center max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="w-1/2 border border-gray-200 p-4 my-10 rounded-md">
          <h1 className="font-bold text-xl mb-5">Login</h1>
          <div className="my-2">
            <Label className={undefined}>Email</Label>
            <Input type="email" placeholder="harsh@gmail.com" value={input.email} name="email" onChange={handleInputChange} className="mt-2 mb-4" />
          </div>
          <div className="my-2">
            <Label className={undefined}>Password</Label>
            <Input type="text" placeholder="xyz@#$12" value={input.password} name="password" onChange={handleInputChange} className="mt-2 mb-4" />
          </div>
          <div className="flex items-center justify-between">
            <RadioGroup className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <Input type="radio" name="role" value="Student" checked={input.role === "Student"} onChange={handleInputChange} className="cursor-pointer" />
                <Label className={undefined}>Student</Label>
              </div>
              <div className="flex items-center gap-3">
                <Input type="radio" name="role" value="Recruiter" checked={input.role === "Recruiter"} onChange={handleInputChange} className="cursor-pointer" />
                <Label className={undefined}>Recruiter</Label>
              </div>
            </RadioGroup>
          </div>
          {
            loading ?
              <Button className="w-full my-4 cursor-pointer"> <Loader2 className="mr-2 h-4  w-4 animate-spin"/>
                Please wait...
              </Button> :
              <Button type="submit" className="w-full my-4 cursor-pointer" variant={undefined} size={undefined}>Login</Button>
          }
                <span>Don't have an account? <Link to="/signup" className="text-blue-700">Signup</Link></span>
              </form>
      </div>
    </div>
  )
}
export default Login