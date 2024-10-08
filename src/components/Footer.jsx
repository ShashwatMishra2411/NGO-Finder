import React from 'react';

const Footer = () => {
    return (
        <>
            <footer className='bg-gray-100 p-6 pt-8'>
                <div className='mx-10 text-justify text-sm'>
                    <h1 className='font-bold text-lg mb-2'>Disclaimer</h1>
                    <p>
                        The data available on the NGO Finder platform is sourced from user submissions and is publicly available on the NGO Darpan website (<a href="https://ngodarpan.gov.in/index.php/home" target="_blank" rel="noopener noreferrer" className='text-blue-600'>https://ngodarpan.gov.in/index.php/home</a>).
                        We do not claim ownership or authenticity of the data provided. All information submitted by users is verified by the developer using the NGO Darpan platform before being displayed, but we cannot guarantee its accuracy or completeness. Users are encouraged to independently verify any information found on our platform before making decisions or taking action based on the data.
                    </p>
                    <p className='mt-2'>
                        NGO Finder does not endorse or take responsibility for the actions or credibility of the NGOs listed. Any use of the data from our platform is at the user's own risk.
                    </p>
                    <p className='mt-2'>
                        For official information and updates, please refer directly to the NGO Darpan website.
                    </p>
                </div>
            </footer>
        </>
    );
};

export default Footer;