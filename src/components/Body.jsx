import React, { useState, useEffect } from 'react';
import { getDatabase, ref, get, push, set, onValue } from "firebase/database";  // Import Firebase functions
import { database } from '../firebase';  // Import initialized database

const Body = () => {


    const [CurrentNGOData, setCurrentNGOData] = useState(0);
    const [NGODataForTable, setNGODataForTable] = useState([]);
    const [CurrentNGONonVerifyData, setCurrentNGONonVerifyData] = useState(0);
    const [CurrentDonationNGOData, setCurrentDonationNGOData] = useState(0);
    const [NonVerifyDonationNGOData, setNonVerifyDonationNGOData] = useState(0);
    const [newData, setNewData] = useState([]); // Will store NGO form data as an array
    const [newKeyValue, setNewKeyValue] = useState(0);
    const [isSubmitted, setIsSubmitted] = useState(false);


    useEffect(() => {
        const db = getDatabase();

        // Fetch NGO_DATA count from 'DataToVerify' node
        const ngoVerifyedData = ref(db, 'NGO_DATA');
        onValue(ngoVerifyedData, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                setCurrentNGOData(Object.keys(data).length);
            } else {
                // Node doesn't exist, so set count to 0
                setCurrentNGOData(0);
            }
        }, (error) => {
            console.error("Error fetching NGO data:", error);
            // Handle error (e.g., set fallback value)
            setCurrentNGOData(0);
        });
    }, []);


    useEffect(() => {
        const db = getDatabase();

        // Fetch NGO_DATA count from 'DataToVerify' node
        const ngoNonVerifyData = ref(db, 'DataToVerify');
        onValue(ngoNonVerifyData, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                setCurrentNGONonVerifyData(Object.keys(data).length);
            } else {
                // Node doesn't exist, so set count to 0
                setCurrentNGONonVerifyData(0);
            }
        }, (error) => {
            console.error("Error fetching NGO data:", error);
            // Handle error (e.g., set fallback value)
            setCurrentNGONonVerifyData(0);
        });
    }, []);



    useEffect(() => {
        // Calculate newKeyValue after fetching data
        setNewKeyValue(CurrentNGOData + CurrentDonationNGOData + 1);
    }, [CurrentNGOData, CurrentDonationNGOData]);

    // Handle NGO form data and store it in an array
    const handleNGOChange = (event) => {
        const { name, value } = event.target;
        setNewData((prevData) => {
            const updatedData = [...prevData]; // Clone previous NGO data array
            updatedData[name] = value; // Store values based on the order of inputs
            return updatedData;
        });


    };

    // Handle Donation form data and store it in an array
    const handleSubmitNGO = (event) => {
        event.preventDefault();
        const db = getDatabase();

        // Reference to the DataToVerify node
        const dataToVerifyRef = ref(db, 'DataToVerify');

        // Fetch all existing keys once (not using onValue to avoid persistent listening)
        get(dataToVerifyRef)
            .then((snapshot) => {
                let existingKeys = [];

                if (snapshot.exists()) {
                    const data = snapshot.val();
                    // Extract existing keys as numbers (e.g., 'NGO_Finder_Data_16' -> 16)
                    existingKeys = Object.keys(data)
                        .map(key => parseInt(key.split('_').pop())) // Extract the numeric part of the key
                        .filter(key => !isNaN(key)) // Filter out any non-number keys just in case
                        .sort((a, b) => a - b); // Sort the keys in ascending order
                }

                let nextAvailableKey;

                // If DataToVerify is empty or NaN
                if (existingKeys.length === 0) {
                    // Set the new key based on CurrentNGOData + 1
                    nextAvailableKey = CurrentNGOData + 1;
                } else {
                    // Get the last key (highest value) and increment by 1
                    nextAvailableKey = Math.max(...existingKeys) + 1;
                }

                // Generate the new key with the next available number
                const newKey = `NGO_Finder_Data_${nextAvailableKey}`;

                console.log(`Generated newKey: ${newKey}`);

                // Save the NGO data array in Firebase under DataToVerify
                set(ref(db, `DataToVerify/${newKey}`), newData)
                    .then(() => {
                        console.log("Data Added Successfully");
                        // Show success message
                        setIsSubmitted(true);

                        // Optionally hide the message after a few seconds
                        setTimeout(() => setIsSubmitted(false), 3000);


                    })
                    .catch(error => {
                        console.error("Error adding data:", error);
                    });

            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    };


    // Donation Data Handling

    useEffect(() => {
        const db = getDatabase();

        // Fetch NGO_DATA count from 'DataToVerify' node
        const ngoNonVerifyData = ref(db, 'donation');
        onValue(ngoNonVerifyData, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                setCurrentDonationNGOData(Object.keys(data).length);
            } else {
                // Node doesn't exist, so set count to 0
                setCurrentDonationNGOData(0);
            }
        }, (error) => {
            console.error("Error fetching NGO data:", error);
            // Handle error (e.g., set fallback value)
            setCurrentDonationNGOData(0);
        });
    }, []);


    useEffect(() => {
        const db = getDatabase();

        // Fetch NGO_DATA count from 'DataToVerify' node
        const ngoVerifyedData = ref(db, 'DonationDataToVerify');
        onValue(ngoVerifyedData, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                setNonVerifyDonationNGOData(Object.keys(data).length);
            } else {
                // Node doesn't exist, so set count to 0
                setNonVerifyDonationNGOData(0);
            }
        }, (error) => {
            console.error("Error fetching NGO data:", error);
            // Handle error (e.g., set fallback value)
            setNonVerifyDonationNGOData(0);
        });
    }, []);


    const handleNGODonationDataChange = (event) => {
        const { name, value } = event.target;
        setNewData((prevData) => {
            const updatedData = [...prevData]; // Clone previous NGO data array
            updatedData[name] = value; // Store values based on the order of inputs
            return updatedData;
        });


    };


    const handleSubmitNGODonationData = (event) => {
        event.preventDefault();
        const db = getDatabase();

        // Reference to the DataToVerify node
        const dataToVerifyRef = ref(db, 'DonationDataToVerify');

        // Fetch all existing keys once (not using onValue to avoid persistent listening)
        get(dataToVerifyRef)
            .then((snapshot) => {
                let existingKeys = [];

                if (snapshot.exists()) {
                    const data = snapshot.val();
                    // Extract existing keys as numbers (e.g., 'NGO_Finder_Data_16' -> 16)
                    existingKeys = Object.keys(data)
                        .map(key => parseInt(key.split('_').pop())) // Extract the numeric part of the key
                        .filter(key => !isNaN(key)) // Filter out any non-number keys just in case
                        .sort((a, b) => a - b); // Sort the keys in ascending order
                }

                let nextAvailableKey;

                // If DataToVerify is empty or NaN
                if (existingKeys.length === 0) {
                    // Set the new key based on CurrentNGOData + 1
                    nextAvailableKey = CurrentDonationNGOData + 1;
                } else {
                    // Get the last key (highest value) and increment by 1
                    nextAvailableKey = Math.max(...existingKeys) + 1;
                }

                // Generate the new key with the next available number
                const newKey = `${nextAvailableKey}`;

                console.log(`Generated newKey: ${newKey}`);

                // Save the NGO data array in Firebase under DataToVerify
                set(ref(db, `DonationDataToVerify/${newKey}`), newData)
                    .then(() => {
                        console.log("Data Added Successfully");
                        // Show success message
                        setIsSubmitted(true);

                        // Optionally hide the message after a few seconds
                        setTimeout(() => setIsSubmitted(false), 3000);


                    })
                    .catch(error => {
                        console.error("Error adding data:", error);
                    });

            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    };


    // Get Data for Table
    useEffect(() => {
        const db = getDatabase();

        // Fetch NGO data from 'NGO_DATA' node
        const dataForTable = ref(db, 'NGO_DATA');
        onValue(dataForTable, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();

                // Convert the object into an array of [key, value] pairs
                const dataArray = Object.entries(data);
                setNGODataForTable(dataArray);
            } else {
                console.log("No NGO data found.");
                setNGODataForTable([]);
            }
        }, (error) => {
            console.error("Error fetching NGO data:", error);
            setNGODataForTable([]);
        });
    }, []);


    return (

        <>

            {/*Table  */}
            <div className='overflow-x-auto'>
                <table className='border-separate border-spacing-0.5 border border-slate-500 table-fixe '>
                    <tr className='bg-slate-200'>
                        <th className='border-separate border-spacing-0.5 border border-slate-500'>Name</th>
                        <th className='border-separate border-spacing-0.5 border border-slate-500'>Address</th>
                        <th className='border-separate border-spacing-0.5 border border-slate-500'>Phone No</th>
                        <th className='border-separate border-spacing-0.5 border border-slate-500'>Email</th>
                        <th className='border-separate border-spacing-0.5 border border-slate-500'>Type</th>
                        <th className='border-separate border-spacing-0.5 border border-slate-500'>Unique ID</th>
                        <th className='border-separate border-spacing-0.5 border border-slate-500'>NGO Image</th>
                        <th className='border-separate border-spacing-0.5 border border-slate-500'>Sector</th>
                        <th className='border-separate border-spacing-0.5 border border-slate-500'>NGO Website</th>
                    </tr>

                    {NGODataForTable.map((val, index) => (
                        <tr key={index} className='hover:bg-slate-200 hover:font-semibold	'>
                            <td className='border-separate border-spacing-0.5 border border-slate-500 text-sm'>{val[1][0]}</td>
                            <td className='border-separate border-spacing-0.5 border border-slate-500 text-sm'>{val[1][1]}</td>
                            <td className='border-separate border-spacing-0.5 border border-slate-500 text-sm'>{val[1][3]}</td>
                            <td className='w-[10%] border-separate border-spacing-0.5 border border-slate-500 text-sm '>{val[1][4]}</td>
                            <td className='border-separate border-spacing-0.5 border border-slate-500 text-sm'>{val[1][5]}</td>
                            <td className='border-separate border-spacing-0.5 border border-slate-500 text-sm'>{val[1][6]}</td>
                            <td className='border-separate border-spacing-0.5 border border-slate-500'><img src={val[1][7]} alt="NGO LOGO" className='h-24 w-24' /></td>
                            <td className='border-separate border-spacing-0.5 border border-slate-500 text-sm'>{val[1][8]}</td>
                            <td className='border-separate border-spacing-0.5 border border-slate-500 text-sm'>
                                <button className='bg-blue-500 text-white px-4 py-2 rounded'><a href={val[1][9]} target='_balnk'>Check Website</a></button></td>
                        </tr>
                    ))}

                </table>
            </div>


            <div className='flex flex-col justify-around md:flex-row sm:flex-col bg-amber-200 py-8'>
                {/* Form 1: NGO Details */}
                <div>
                    <form className='px-3 py-3 sm:text-1' onSubmit={handleSubmitNGO} id='NGODataForm'>
                        <h6 className="mt-1 text-sm leading-6 text-gray-600 ">
                            NGO Details. This information will be displayed publicly so be careful what you share.
                        </h6>

                        {/* NGO Name */}
                        <div className='flex gap-5 py-2'>
                            <div className='w-44'>
                                <label htmlFor="name" className='font-bold w-30'>NGO Name</label>
                            </div>
                            <input
                                type="text"
                                id="name"
                                name="0" // Store in the first index of the NGO array
                                placeholder="NGO Name"
                                className='w-60'
                                onChange={handleNGOChange}
                                required
                            />
                        </div>

                        {/* NGO Address */}
                        <div className='flex gap-5 py-2'>
                            <div className='w-44'>
                                <label htmlFor="address" className='font-bold w-30'>NGO Address</label>
                            </div>
                            <input
                                id="address"
                                name="1" // Store in the second index of the NGO array
                                placeholder="NGO Address"
                                className='w-60'
                                onChange={handleNGOChange}
                                required
                            />
                        </div>

                        {/* NGO Reg ID */}
                        <div className='flex gap-5 py-2'>
                            <div className='w-44'>
                                <label htmlFor="regId" className='font-bold w-30'>NGO Reg ID</label>
                            </div>
                            <input
                                type="text"
                                id="regId"
                                name="2" // Store in the third index of the NGO array
                                placeholder="NGO Reg ID"
                                className='w-60'
                                onChange={handleNGOChange}
                                required
                            />
                        </div>

                        {/* NGO Phone No */}
                        <div className='flex gap-5 py-2'>
                            <div className='w-44'>
                                <label htmlFor="phoneNo" className='font-bold w-30'>NGO Phone No</label>
                            </div>
                            <input
                                type="number"
                                id="phoneNo"
                                name="3" // Store in the fourth index of the NGO array
                                placeholder="NGO Phone No"
                                className='w-60'
                                onChange={handleNGOChange}
                                required
                            />
                        </div>

                        {/* NGO Email */}
                        <div className='flex gap-5 py-2'>
                            <div className='w-44'>
                                <label htmlFor="email" className='font-bold w-30'>NGO Email</label>
                            </div>
                            <input
                                type="email"
                                id="email"
                                name="4" // Store in the fifth index of the NGO array
                                placeholder="NGO Email"
                                className='w-60'
                                onChange={handleNGOChange}
                                required
                            />
                        </div>

                        {/* NGO Type */}
                        <div className='flex gap-5 py-2'>
                            <div className='w-44'>
                                <label htmlFor="type" className='font-bold w-30'>NGO Type</label>
                            </div>
                            <input
                                type="text"
                                id="type"
                                name="5" // Store in the sixth index of the NGO array
                                placeholder="NGO Type"
                                className='w-60'
                                onChange={handleNGOChange}
                                required
                            />
                        </div>

                        {/* NGO Unique ID */}
                        <div className='flex gap-5 py-2'>
                            <div className='w-44'>
                                <label htmlFor="uniqueId" className='font-bold w-30'>NGO Unique ID</label>
                            </div>
                            <input
                                type="text"
                                id="uniqueId"
                                name="6" // Store in the seventh index of the NGO array
                                placeholder="NGO Unique ID"
                                className='w-60'
                                onChange={handleNGOChange}
                                required
                            />
                        </div>

                        {/* NGO Image Link */}
                        <div className='flex gap-5 py-2'>
                            <div className='w-44'>
                                <label htmlFor="image" className='font-bold w-30'>NGO Image Link</label>
                            </div>
                            <input
                                type="text"
                                id="image"
                                name="7" // Store in the eighth index of the NGO array
                                placeholder="NGO Image Link"
                                className='w-60'
                                onChange={handleNGOChange}
                                required
                            />
                        </div>

                        {/* NGO Working Sectors */}
                        <div className='flex gap-5 py-2'>
                            <div className='w-44'>
                                <label htmlFor="sectors" className='font-bold w-30'>NGO Working Sectors</label>
                            </div>
                            <input
                                type="text"
                                id="sectors"
                                name="8" // Store in the ninth index of the NGO array
                                placeholder="NGO Working Sectors"
                                className='w-60'
                                onChange={handleNGOChange}
                                required
                            />
                        </div>

                        {/* NGO Website */}
                        <div className='flex gap-5 py-2'>
                            <div className='w-44'>
                                <label htmlFor="website" className='font-bold w-30'>NGO Website</label>
                            </div>
                            <input
                                type="text"
                                id="website"
                                name="9" // Store in the tenth index of the NGO array
                                placeholder="NGO Website"
                                className='w-60'
                                onChange={handleNGOChange}
                                required
                            />
                        </div>

                        <button type="submit" className='bg-blue-500 text-white px-4 py-2 rounded'>Submit NGO</button>
                        <button type="reset" className='bg-blue-500 text-white px-4 py-2 rounded ml-4'>Reset</button>
                    </form>
                    {/* Show success message */}
                    {isSubmitted && <p>Data submitted successfully!</p>}
                </div>


                {/* Form 2: Donation Data */}
                <div>
                    <form className='px-3 py-3' onSubmit={handleSubmitNGODonationData}>
                        <h6 className="mt-1 text-sm leading-6 text-gray-600 ">
                            Donation Data. Please provide all the information about the donation.
                        </h6>

                        {/* NGO Name For Donation*/}
                        <div className='flex gap-5 py-2'>
                            <div className='w-44'>
                                <label htmlFor="ngoNameForDonation" className='font-bold w-30'>NGO Name</label>
                            </div>
                            <input
                                type="text"
                                id="ngoNameForDonation"
                                onChange={handleNGODonationDataChange}
                                name="0" // Store in the first index of the Donation array
                                placeholder="NGO Name"
                                className='w-60'
                                required
                            />
                        </div>

                        {/* NGO Fund Usage */}
                        <div className='flex gap-5 py-2'>
                            <div className='w-44'>
                                <label htmlFor="ngoFundUsage" className='font-bold w-30'>Fund Usage</label>
                            </div>
                            <input
                                type="text"
                                id="ngoFundUsage"
                                onChange={handleNGODonationDataChange}
                                name="1" // Store in the second index of the Donation array
                                placeholder="Fund Use For"
                                className='w-60'
                                required
                            />
                        </div>

                        {/*NGO Image Link*/}
                        <div className='flex gap-5 py-2'>
                            <div className='w-44'>
                                <label htmlFor="ngoImageLink" className='font-bold w-30'>NGO Image Link</label>
                            </div>
                            <input
                                type="link"
                                id="ngoImageLink"
                                onChange={handleNGODonationDataChange}
                                name="2" // Store in the third index of the Donation array
                                placeholder="NGO Image Link"
                                className='w-60'
                                required
                            />
                        </div>

                        {/* Donation Page Link*/}
                        <div className='flex gap-5 py-2'>
                            <div className='w-44'>
                                <label htmlFor="donationPageLink" className='font-bold w-30'>Donation Page Link</label>
                            </div>
                            <input
                                type="link"
                                id="donationPageLink"
                                onChange={handleNGODonationDataChange}
                                placeholder="NGO Doantion Page Link"
                                name="3" // Store in the fourth index of the Donation array
                                className='w-60'
                                required
                            />
                        </div>

                        {/* NGO Official Site Link*/}
                        <div className='flex gap-5 py-2'>
                            <div className='w-44'>
                                <label htmlFor="ngoSiteLink" className='font-bold w-30'>NGO Site Link</label>
                            </div>
                            <input
                                type="link"
                                id="ngoSiteLink"
                                onChange={handleNGODonationDataChange}
                                name="4" // Store in the fourth index of the Donation array
                                className='w-60'
                                placeholder="NGO Site Link"
                                required
                            />
                        </div>

                        <button type="submit" className='bg-green-500 text-white px-3 py-2 rounded-md'>Submit Donation</button>
                        <button type="reset" className='bg-green-500 text-white px-3 py-2 ml-6 rounded-md'>Reset</button>

                    </form>
                    {/* Show success message */}
                    {isSubmitted && <p>Data submitted successfully!</p>}
                </div>
            </div>

        </>
    );
};

export default Body;