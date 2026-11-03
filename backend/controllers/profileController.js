const getMyProfile = async (req , res) =>{
    try{
        const{data: profile,error} = await req.supabase //
        .from("profiles") //target profiles in table 
        .select("*") // fetch user cols 
        .eq("id" , req.user.id) //filter row where col ID match
        .maybeSingle();

        if(error){
            console.log("Profile Fetch Error",error.message);

            return res.status(500).json({
                success:false,
                message:"Unable to fetch profiles",
            });
        }
        
        //identify profile
        if(!profile){
            return res.status(404).json({
            success:false,
            message:"Unable to fetch profiles",
            });
        }

        //profile not found
        return res.status(200).json({
        success:true,
        message:"Profile Fetch",
        profile,
        });
    }catch(error){
        console.error("Profile controller error:", error.message);
        return res.status(500).json({
        success:false,
        message:"Internal server error",
        });
    }
};

module.exports ={getMyProfile};