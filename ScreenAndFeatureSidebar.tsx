/* eslint-disable jsx-a11y/anchor-is-valid */
import { Tooltip } from '@mui/material';
import { useEffect, useState } from 'react';
import { BiSearch } from 'react-icons/bi';
import { IoMdAddCircleOutline } from 'react-icons/io';
import { MdDeleteOutline } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import ATMAccordian from 'src/components/UI/atoms/ATMAccordian/ATMAccordian';
import ATMInputAdormant from 'src/components/UI/atoms/formFields/ATMInputAdormant/ATMInputAdormant';
import { setRequirementGathering, setSelectedPlatformData } from 'src/redux/slices/RequirementGatheringSlice';
import { RootState } from 'src/redux/store';
import { showConfirmationDialog } from 'src/utils/showConfirmationDialog';
import ReactDragListView from 'react-drag-listview'

const ScreenAndFeatureSidebar = ({ setSelectedData, selectedData }: any) => {
    const dispatch = useDispatch();

    // Extracting state data using useSelector hook
    const { requirementGatheringData, selectedPlatformData } = useSelector((state: RootState) => state.requirementGathering);

    // State variables
    const [searchValue, setSearchValue] = useState('');
    const [openAccordionId, setOpenAccordionId] = useState<any>(null);
    const [first, setFirst] = useState<any>({})
    const [selectedScreenIndex, setSelectedScreenIndex] = useState(0)

    // Function to handle change in selected data
    const handleChange = (data: any) => {
        setSelectedData(data);
    };

    // Function to get background color for selected screen or feature
    const getBackgroundColor = (screenOrFeature: any, type: string) => {
        if (type === 'screen') {
            return selectedData?.screenId === screenOrFeature ? 'bg-slate-200 px-2 py-0.5 rounded' : 'px-2 py-0.5';
        } else {
            return selectedData?.featureId === screenOrFeature ? 'bg-slate-200 px-2 py-0.5 rounded' : 'px-2 py-0.5';
        }
    };

    // Add Screen Function
    const handleAddScreenClick = (platFormData: any[], platFormId: string) => {
        const newScreenId = `${new Date().getTime()}`;
        const newScreen: any = {
            id: platFormId + (platFormData.length + 1).toString() + newScreenId,
            // heading: `New Screen ${platFormData.length + 1}`,
            heading: `New Screen `,
            subHeading: 'Add Subheading Text Here',
            features: [],
            description: ''
        };

        const newPlatFormData = [...platFormData, newScreen];

        const newRequirementGathering = requirementGatheringData?.map((item: any) =>
            item._id === platFormId ? { ...item, platFormData: newPlatFormData } : item
        );

        const updatedFeature = {
            platFormId: selectedPlatformData?._id,
            screenIndex: platFormData.length,
            type: 'screen',
            screenId: newScreen.id,
            featureIndex: null,
            featureId: null,
            features: null,
            data: {
                heading: newScreen.heading,
                description: newScreen.description
            }
        };

        setFirst(newScreen);
        setSelectedScreenIndex(newPlatFormData.length - 1);
        setSelectedData(updatedFeature);
        dispatch(setRequirementGathering(newRequirementGathering));
        dispatch(setSelectedPlatformData({ ...selectedPlatformData, platFormData: newPlatFormData }));
    };

    // Add Feature Function
    const handleAddFeatureClick = (platFormId: string, features: any[], screenId: string | null, index: number) => {
        const newFeatureId = `${new Date().getTime()}`;
        const newFeature: any = {
            featureId: platFormId + screenId + (features.length + 1).toString() + newFeatureId,
            // title: `New Feature ${features.length + 1}`,
            title: `New Feature `,
            description: ''
        };

        const newFeaturesData = [...features, newFeature];

        const newRequirementGathering = requirementGatheringData?.map((item: any) =>
            item._id === platFormId
                ? {
                    ...item,
                    platFormData: item.platFormData.map((platformItem: any, idx: number) =>
                        idx === index
                            ? { ...platformItem, features: [...newFeaturesData] }
                            : platformItem
                    )
                }
                : item
        );
        const updatedFeature = {
            ...selectedData,
            screenId: screenId,
            type: 'feature',
            featureIndex: features.length,
            featureId: newFeature.featureId,
            features: newFeature,
            data: {
                heading: newFeature.title,
                description: newFeature.description
            }
        };

        setFirst((prev: any) => ({ ...prev, features: newFeaturesData }));
        setSelectedData(updatedFeature);
        setOpenAccordionId(screenId);
        dispatch(setRequirementGathering(newRequirementGathering));
        dispatch(setSelectedPlatformData({
            ...selectedPlatformData, platFormData: selectedPlatformData.platFormData.map((platformItem: any, idx: number) =>
                idx === index
                    ? { ...platformItem, features: newFeaturesData }
                    : platformItem
            )
        }));
    };

    // Function to handle Delete Screen 
    const handleDelete = (platFormId: string, screenId: string) => {
        showConfirmationDialog({
            title: "Hands Up",
            text: "Are you sure want to delete this screen?",
            icon: "question",
            showCancelButton: true,
            next: (result) => {
                if (result?.isConfirmed) {
                    handleDeleteScreenClick(platFormId, screenId)
                    //   deleteExpense(row).then((res: any) => {
                    //     if (res.error) {
                    //       showToast("error", res?.error?.data?.message);
                    //     } else {
                    //       showToast("success", res?.data?.message);
                    //     }
                    //   });
                }
            },
        });
    };

    const handleDeleteScreenClick = (platFormId: string, screenId: string) => {
        // Filter out the specified screen from the requirement gathering data and selected platform data
        const newRequirementGathering = requirementGatheringData?.map((item: any) =>
            item._id === platFormId
                ? { ...item, platFormData: item.platFormData.filter((screen: any) => screen.id !== screenId) }
                : item
        );

        const newSelectedPlatformData = {
            ...selectedPlatformData,
            platFormData: selectedPlatformData.platFormData.filter((screen: any) => screen.id !== screenId)
        };

        // Reset selected data if the deleted screen was the selected screen
        const newSelectedData = selectedData?.screenId === screenId
            ? {
                platFormId: selectedPlatformData?._id,
                screenIndex: null,
                type: null,
                screenId: null,
                featureIndex: null,
                featureId: null,
                features: null,
                data: null
            }
            : selectedData;

        // Update the state and dispatch the actions
        setSelectedData(newSelectedData);
        dispatch(setRequirementGathering(newRequirementGathering));
        dispatch(setSelectedPlatformData(newSelectedPlatformData));
    };

    // Function to handle Delete Feature  

    const handleFeatureDelete = (platFormId: string, screenId: string, featureId: string, screenIndex: number) => {
        showConfirmationDialog({
            title: "Hands Up",
            text: "Are you sure want to delete this feature?",
            icon: "question",
            showCancelButton: true,
            next: (result) => {
                if (result?.isConfirmed) {
                    handleDeleteFeatureClick(platFormId, screenId, featureId, screenIndex)
                    //   deleteExpense(row).then((res: any) => {
                    //     if (res.error) {
                    //       showToast("error", res?.error?.data?.message);
                    //     } else {
                    //       showToast("success", res?.data?.message);
                    //     }
                    //   });
                }
            },
        });
    };

    const handleDeleteFeatureClick = (platFormId: string, screenId: string, featureId: string, screenIndex: number) => {
        // Map over requirement gathering data to find the platform
        const newRequirementGathering = requirementGatheringData?.map((item: any) => {
            if (item._id === platFormId) {
                // Map over platFormData to find the screen
                const newPlatFormData = item.platFormData.map((platformItem: any) => {
                    if (platformItem.id === screenId) {
                        // Filter out the feature to be deleted
                        const newFeatures = platformItem.features.filter((feature: any) => feature.featureId !== featureId);
                        return { ...platformItem, features: newFeatures };
                    }
                    return platformItem;
                });
                return { ...item, platFormData: newPlatFormData };
            }
            return item;
        });

        // Update selected platform data
        const newSelectedPlatformData = {
            ...selectedPlatformData,
            platFormData: selectedPlatformData.platFormData.map((platformItem: any) => {
                if (platformItem.id === screenId) {
                    const newFeatures = platformItem.features.filter((feature: any) => feature.featureId !== featureId);
                    setFirst((prev: any) => ({ ...prev, features: newFeatures }));
                    return { ...platformItem, features: newFeatures };
                }
                return platformItem;
            })
        };

        // Update selected data if the deleted feature was selected
        let newSelectedData = { ...selectedData };
        if (selectedData?.featureId === featureId) {
            newSelectedData = {
                platFormId: selectedPlatformData?._id,
                screenIndex: screenIndex,
                type: 'screen',
                screenId: screenId,
                featureIndex: null,
                featureId: null,
                features: null,
                data: {
                    heading: selectedPlatformData?.platFormData[screenIndex]?.heading,
                    description: selectedPlatformData?.platFormData[screenIndex]?.description
                }
            };
        }

        // Update the state and dispatch the actions
        setSelectedData(newSelectedData);
        dispatch(setRequirementGathering(newRequirementGathering));
        dispatch(setSelectedPlatformData(newSelectedPlatformData));
    };
  
// Drag Prop Screen
    const screenDragProp = {
        onDragEnd(fromIndex: number, toIndex: number) {
            let platFormIndex = requirementGatheringData?.findIndex((ele: any) => {

                return selectedPlatformData?._id === ele?._id
            }) || 0
            const newData = [...requirementGatheringData[platFormIndex]?.platFormData] // Make a shallow copy of the array
            const [movedItem] = newData.splice(fromIndex, 1) // Remove the moved item
            newData.splice(toIndex, 0, movedItem) // Insert the moved item at the new index
            let newReq = [...requirementGatheringData]
            newReq[platFormIndex] = {
                ...newReq[platFormIndex],
                platFormData: [...newData]
            }
            let selectedPlatformDataNew = {
                ...selectedPlatformData,
                platFormData: [...newData]
            }
            dispatch(setRequirementGathering(newReq))
            dispatch(setSelectedPlatformData(selectedPlatformDataNew));
        },
        nodeSelector: 'label',
        handleSelector: 'a',
        ignoreSelector: 'a',
        handle: '.drag-handle',
    }

//Drag feature Handle function 
    const handleFeatureDrag = (fromIndex: number, toIndex: number, parentIndex: number) => {
        let platFormIndex = requirementGatheringData?.findIndex((ele: any) => {

            return selectedPlatformData?._id === ele?._id
        }) || 0
        const newData = [...requirementGatheringData[platFormIndex]?.platFormData[parentIndex].features] // Make a shallow copy of the array
        const [movedItem] = newData.splice(fromIndex, 1) // Remove the moved item
        newData.splice(toIndex, 0, movedItem) // Insert the moved item at the new index

        const newRequirementGathering = requirementGatheringData?.map((item: any) =>
            item._id === selectedPlatformData?._id
                ? {
                    ...item,
                    platFormData: item.platFormData.map((platformItem: any, idx: number) =>
                        idx === parentIndex
                            ? { ...platformItem, features: [...newData] }
                            : platformItem
                    )
                }
                : item
        );

        let selectedPlatformDataNew = {
            ...selectedPlatformData,
            platFormData: selectedPlatformData?.platFormData.map((platformItem: any, idx: number) =>
                idx === parentIndex
                    ? { ...platformItem, features: [...newData] }
                    : platformItem
            )
        }
        dispatch(setRequirementGathering(newRequirementGathering))
        dispatch(setSelectedPlatformData(selectedPlatformDataNew));

    }
    const featureDragProps= {
        nodeSelector: 'span',
        handleSelector: 'a',
        ignoreSelector: 'a',
        handle: '.drag-handle2',
    }

    // UseEffect For Shortcut keys
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
            if ((isMac && event.metaKey && (event.key === '/')) || (!isMac && event.ctrlKey && (event.key === '/'))) {

                handleAddScreenClick(selectedPlatformData?.platFormData, selectedPlatformData?._id);
            } else if ((isMac && event.metaKey && (event.key === '.')) || (!isMac && event.ctrlKey && (event.key === '.') && openAccordionId)) {
                let addFeatureData = selectedPlatformData?.platFormData?.find((ele: any) => {

                    return first?.id === ele?.id
                })
                // console.log(addFeatureData, "addFeatureData");
                handleAddFeatureClick(selectedPlatformData?._id, addFeatureData?.features, first?.id, selectedScreenIndex);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [handleAddScreenClick, openAccordionId, handleAddFeatureClick]);

    // 
    useEffect(() => {
        dispatch(setSelectedPlatformData(requirementGatheringData?.[0]));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div className=" grid grid-cols-12 p-2 gap-1 bg-slate-100 border rounded">
            <div className='col-span-3'>
                {requirementGatheringData?.map((requirement: any) => {
                    return (
                        <div
                            key={requirement._id}
                            className={`p-1 border flex justify-center rounded text-sm font-medium mb-3 mt-1 cursor-pointer ${selectedPlatformData?._id === requirement._id ? 'bg-slate-300' : ''}`}
                            onClick={() => {
                                dispatch(setSelectedPlatformData(requirement));
                            }}
                        >
                            <div>{requirement?.platformTitle}</div>
                        </div>
                    )
                })}
            </div>
            <div className='col-span-9'>
                <div className='flex items-center my-1 sticky top-0'>
                    <div className="w-full">
                        <ATMInputAdormant
                            name=""
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            adormant={<BiSearch />}
                            adormantProps={{
                                position: 'start',
                                extraClasses: 'bg-white border-0',
                            }}
                            inputProps={{ className: 'bg-white' }}
                            placeholder="Search..."
                        />
                    </div>
                    <div
                        className='bg-white rounded-r p-2.5 cursor-pointer -mr-1'
                        onClick={() => {
                            handleAddScreenClick(selectedPlatformData?.platFormData, selectedPlatformData?._id)
                        }}
                    >
                        <IoMdAddCircleOutline
                            size={18}
                            className='hover:text-green-400' />
                    </div>
                </div>
                <ReactDragListView {...screenDragProp}>
                    <div className="overflow-y-auto h-[90vh] w-full">
                        {selectedPlatformData?.platFormData?.map((accordion: any, ind: number) => (
                            <label className='w-full' key={ind}>

                                <a
                                    href=""
                                    className="  drag-handle w-full"
                                >
                                    <ATMAccordian
                                        extraClass='draggable-screen drag-handle '
                                        isOpen={accordion.id === openAccordionId}
                                        key={accordion.id}
                                        headingOnClick={() => {
                                            let updatedfeature = {
                                                platFormId: selectedPlatformData?._id,
                                                screenIndex: ind,
                                                screenId: accordion.id,
                                                type: 'screen',
                                                featureIndex: null,
                                                featureId: null,
                                                features: null,
                                                data: {
                                                    heading: accordion?.heading,
                                                    description: accordion?.description
                                                }

                                            }
                                            handleChange(updatedfeature);
                                            setOpenAccordionId(accordion.id);
                                            setFirst(accordion)
                                            setSelectedScreenIndex(ind)
                                        }}
                                        headingExtraClass={`cursor-pointer drag-handle ${getBackgroundColor(accordion.id, 'screen')}`}
                                        heading={accordion.heading}
                                        subHeading={
                                            <div className='flex justify-end gap-2 '>
                                                <IoMdAddCircleOutline
                                                    size={20}
                                                    className="cursor-pointer hover:text-green-400"
                                                    onClick={() => {
                                                        handleAddFeatureClick(selectedPlatformData?._id, accordion.features, accordion.id, ind);
                                                    }}
                                                />
                                                <div className=''>
                                                    {/* Delete Screen */}
                                                    <MdDeleteOutline
                                                        className="cursor-pointer hover:text-red-400"
                                                        onClick={() => {
                                                            handleDelete(selectedPlatformData?._id, accordion.id);
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        }

                                    >
                                        <div className=''>
                                            <div className='ml-8 truncate'>
                                                <ReactDragListView {...featureDragProps} onDragEnd={(fromIndex: number, toIndex: number) => handleFeatureDrag(fromIndex, toIndex, ind)}>
                                                    {accordion?.features?.map((item: any, fInd: number) => (
                                                        <span className='w-full' key={fInd}>
                                                            <a
                                                                href=""
                                                                className="  drag-handle2 w-full"
                                                            >
                                                                <div
                                                                    key={item.featureId}
                                                                    className={`w-full drag-handle2 cursor-pointer flex group items-center ${getBackgroundColor(item.featureId, 'feature')}`}
                                                                    onClick={() => {
                                                                        let updatedfeature = {
                                                                            platFormId: selectedPlatformData?._id,
                                                                            screenIndex: ind,
                                                                            type: 'feature',
                                                                            screenId: accordion.id,
                                                                            featureIndex: fInd,
                                                                            featureId: item.featureId,
                                                                            features: item,
                                                                            data: {
                                                                                heading: item?.title,
                                                                                description: item?.description
                                                                            }

                                                                        }
                                                                        handleChange(updatedfeature)

                                                                    }}
                                                                >
                                                                    <Tooltip className='w-full' title={item?.title}>
                                                                        <span className={`truncate text-md drag-handle2 group`}> {item?.title} </span>
                                                                    </Tooltip>

                                                                    {/* Delete Feature */}
                                                                    <div className=''>
                                                                        <MdDeleteOutline
                                                                            className="cursor-pointer hover:text-red-400 group-hover:opacity-100 opacity-0 transition-all"
                                                                            onClick={() => {
                                                                                handleFeatureDelete(selectedPlatformData?._id, accordion.id, item.featureId, ind)
                                                                            }}
                                                                            size={20}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </a></span>
                                                    ))}
                                                </ReactDragListView>
                                            </div>

                                        </div>
                                    </ATMAccordian>
                                </a>

                            </label>

                        ))}
                    </div>
                </ReactDragListView>
            </div>
        </div>
    );
};

export default ScreenAndFeatureSidebar;
