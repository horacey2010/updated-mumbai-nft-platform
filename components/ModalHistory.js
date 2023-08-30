import { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import styles from "../styles/ModalHistory.module.css"

export default function ModalHistory({ show, onClose, children }) {
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
                    <a href="#" onClick={handleClose}>
                    <button class="button is-dark is-small is-rounded">Close</button>
                    </a>
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