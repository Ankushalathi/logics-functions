import React, { useState } from 'react'
import ScreenAndFeatureSidebar from '../ScreenAndFeatureSidebar'
import ScreenFeatureList from './ScreenFeatureList'

const ScreenFeatureWrapper = () => {

    const [selectedData, setSelectedData] = useState([]); // State to manage selected data

    return (
        <div className='grid grid-cols-12 gap-4 px-2 my-4'>
            <div className='col-span-3'>
                <ScreenAndFeatureSidebar
                    setSelectedData={setSelectedData}
                    selectedData={selectedData} // Pass the setter for selected data 
                />
            </div>
            <div className='col-span-9'>
                <ScreenFeatureList
                    selectedData={selectedData} // Pass the selected data to the list component
                />
            </div>
        </div>
    )
}

export default ScreenFeatureWrapper