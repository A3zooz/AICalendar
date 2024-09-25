import React, {useState} from 'react'
import AvailabilityForm from './AvailabilityForm'
import './TutorManagement.css'
import ViewSchedule from './ViewSchedule'

const TutorManagement = () => {
    const [activeTab, setActiveTab] = useState('create');

    const renderTab= () => {
        if(activeTab === 'create'){
            return <AvailabilityForm />
        }
        if(activeTab === 'view')
            return <ViewSchedule />
        return null
    }
    return (
        <div className='tutor-management'>
            <div className='tabs'>
                <button className={`tab ${activeTab === 'view' ? 'active' : ''}`}
                onClick={() => setActiveTab('view')}>View Schedule</button>
                <button className={`tab ${activeTab === 'create' ? 'active' : ''}`}
                onClick={() => setActiveTab('create')}>Create Schedule</button>

            </div>
            {renderTab()}
        </div>

    )

}


export default TutorManagement;

    
