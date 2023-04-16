
import { type NextPage } from 'next'
import React from 'react'
import { useRouter } from 'next/router'
import CreateGpuForm from '../../components/forms/parts/create-gpu'






const CreatePart: NextPage = () => {
    const router = useRouter()
    const { type } = router.query
    if(type === "gpu") {
        return <CreateGpuForm />
    }
    return <div>
        <h1>Create Part</h1>
    </div>
}

export default CreatePart
