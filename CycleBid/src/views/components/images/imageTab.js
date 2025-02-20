import { useState } from 'react'


import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'
import ImageGallery from '../images/imageGallery'




const ImageTab = ({ tab1,tab2,tab3,tab4 }) => {
    const [valueInside, setValueInside] = useState('1')

    return (
        <TabContext value={valueInside}>
            <TabPanel value='1'>
                <ImageGallery images={tab1} closeDisplay={true} />
            </TabPanel>

            <TabPanel value='2'>
                <ImageGallery images={tab2} closeDisplay={true}/>
            </TabPanel>

            <TabPanel value='3'>
                <ImageGallery images={tab3} closeDisplay={true}/>
            </TabPanel>

            <TabPanel value='4'>
                <ImageGallery images={tab4} closeDisplay={true}/>
            </TabPanel>
        </TabContext>
    );
};

export default ImageTab;


