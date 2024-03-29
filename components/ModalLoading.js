import { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import styles from "../styles/ModalLoading.module.css"

export default function ModalLoading({ show, onClose, children }) {
    const [isBrowser, setIsBrowser] = useState(false)

    useEffect(() => {
        setIsBrowser(true)
    }, [])

    const handleClose = (e) => {
        e.preventDefault()
        onClose()
    }

    const modalContent = show ? (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <div className={styles.header}>
                    <></>
                </div>
                <div className={styles.body}>{children}</div>
            </div>
        </div>
    ) : null

    if (isBrowser) {
        return ReactDOM.createPortal(
            modalContent,
            document.getElementById("modal-root")
        )
    } else {
        return null
    }
}