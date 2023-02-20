import React, {useState} from 'react';

const UseSelectFile = () => {
    const [selectedFile, setSelectedFile] = useState("");

    const onSelectFile = (e) => {
        const reader = new FileReader();
        if (e.target.files?.[0]) {
            reader.readAsDataURL(e.target.files[0]);
        }

        reader.onload = (readerEvent) => {
            if (readerEvent.target?.result) {
                setSelectedFile(readerEvent.target?.result);
            }
        }
    }
    return {
        selectedFile,
        setSelectedFile,
        onSelectFile
    };
};

export default UseSelectFile;