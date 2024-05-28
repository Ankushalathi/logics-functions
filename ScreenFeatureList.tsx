import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import ATMLoadingButton from 'src/components/UI/atoms/ATMLoadingButton/ATMLoadingButton'
import MOLMarkdownEditor from 'src/components/UI/molecules/MOLMarkdownEditor/MOLMarkdownEditor'
import {
    setRequirementGathering,
    setSelectedPlatformData
} from "src/redux/slices/RequirementGatheringSlice"
import { RootState } from 'src/redux/store'

type screenFeatureprop = {
    selectedData: any
}

const ScreenFeatureList = ({ selectedData }: screenFeatureprop) => {

    const { requirementGatheringData } = useSelector((state: RootState) => state.requirementGathering);

    const inputRef = useRef<HTMLInputElement>(null);

    const [inputValue, setInputValue] = useState('')
    const [textEditor, setTextEditor] = useState('')
    const dispatch = useDispatch()

    useEffect(() => {
        if (selectedData?.data?.heading && inputRef.current) {
            inputRef.current.focus();
        }
    }, [selectedData]);


    useEffect(() => {
        setInputValue(selectedData?.data?.heading || '')
        setTextEditor(selectedData?.data?.description || '')
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedData])

    const handleScreen = (item: any) => {
        let updatedItem = { ...item };

        if (selectedData?.type === 'screen') {
            // Update screen-level data
            updatedItem.platFormData = updatedItem.platFormData.map((platformData: any, index: number) => {
                if (index === selectedData?.screenIndex) {
                    return {
                        ...platformData,
                        heading: inputValue,
                        description: textEditor,
                    };
                }
                return platformData;
            });
        } else {
            // Update feature-level data
            updatedItem.platFormData = updatedItem?.platFormData.map((platformData: any, index: number) => {
                if (index === selectedData?.screenIndex) {
                    return {
                        ...platformData,
                        features: platformData.features?.map((feature: any, featureIndex: number) => {
                            if (featureIndex === selectedData.featureIndex) {
                                return {
                                    ...feature,
                                    title: inputValue,
                                    description: textEditor,
                                };
                            }
                            return feature;
                        }),
                    };
                }
                return platformData;
            });
        }

        return updatedItem;
    };


    // eslint-disable-next-line react-hooks/exhaustive-deps
    const handleSubmitNewData = () => {
        let newRequirementGathering = requirementGatheringData?.map((item: any) => {
            return item._id === selectedData?.platFormId ? handleScreen({ ...item }) : item
        }
        );
        dispatch(setRequirementGathering(newRequirementGathering));
        const selectedPlatformItem = newRequirementGathering?.find((item: any) => item?._id === selectedData?.platFormId);
        dispatch(setSelectedPlatformData({ ...selectedPlatformItem }));

    };

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.ctrlKey && event.key === 's') {
                event.preventDefault();
                handleSubmitNewData();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [handleSubmitNewData]);

    return (
        <div>
            <div className='flex justify-end cursor-pointer'>
                <ATMLoadingButton onClick={handleSubmitNewData} className='w-36' type="submit">
                    Save
                </ATMLoadingButton>
            </div>
            <div className="grid grid-cols-12 gap-2 mt-8">
                <div className='col-start-2 col-span-10'>
                    {selectedData?.data?.heading && (
                        <div className='flex flex-col'>
                            <div className="text-lg mt-2">
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => {
                                        setInputValue(e.target.value)
                                    }}
                                    placeholder="Enter Screen"
                                    ref={inputRef}
                                    className="w-full text-2xl font-medium p-2 rounded focus:outline-none focus:border-blue-500"
                                    style={{ caretColor: 'blue' }}
                                />
                            </div>
                            <div className="z-0 mt-2">
                                <MOLMarkdownEditor
                                    placeholder="Write description or drag your files here...."
                                    value={textEditor}
                                    onChange={(e: any) => {
                                        setTextEditor(e);
                                    }}
                                    extraClassName=' border-0'
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ScreenFeatureList
