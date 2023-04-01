import { useSession } from 'next-auth/react'
import Image from 'next/image'
import React from 'react'

export default function UserProfilePic() {

    const {data: session} = useSession()


    if(session?.user?.image) return (
        <div>
            <Image src={session.user.image} width={128} height={128} alt="User Profile Picture" />
        </div>

    )

    return (
        <div>
            
        </div>
    )    
}