import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../hook/useAuth";

const RequireAuth = () => {
    const { auth } = useAuth();  //logged in or not
    const location = useLocation();
    if(auth.accessToken){
        return (<Outlet/> );// make auth work on all children route
    }else if (!auth.accessToken&&auth.accessToken==='expired'){
        return( 
            <div>
                  <p>
            timeout,token expired
            ご協力ありがとうございました。
           </p>
            </div>
        ); 
    }else{
        
        return (<Navigate to="/register" state={{ from: location }} replace />);
    }
    
    // return (
    //     auth?.accessToken
    //         ?<Outlet/> // make auth work on all children route
    //         :<Navigate to="/register" state={{ from: location }} replace />

    //         // token是undefine就跳register
    //         // 如果token为空，且不是undefine，就跳弹信息
    //         // 不确定expire是undefine

    // );
}

export default RequireAuth;


// 正确logout 验证
// all page no forward backward
// expire logout验证
// display 防止重复点击
