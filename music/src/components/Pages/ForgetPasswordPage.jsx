import { useState, Fragment } from "react";
import axios from "axios";

function ForgetPassword() {
    const [email, setEmail] = useState(null);
    const [alert, setAlert] = useState(null);
    const [error, setError] = useState(null);
    const [status, setStatus] = useState(false);

    const handleResendEmail = (e) =>{
        e.preventDefault();
        const user ={email}
        postToSend(user);
    }

    const postToSend = (user) =>{
        setAlert(null);
        setError(null);
        setStatus(true);

        axios.post('http://localhost:5015/api/auth/resend', user, {
            headers: {
                'Authorization': localStorage.getItem('token'),
            }
        })
            .then(respone => {
                const res = respone.data;
                if(res.code === 0){
                    setAlert(res.message);
                }else{
                    setError(res.message);
                }
                setStatus(false);
            })
            .catch(err => {
                setError(error);
            });
    }

    return ( 
        <Fragment>
            <div style={{border: "1px solid #dee2e6", borderRadius: "0.25rem", marginTop: '5%'}}>
                <div style={{background: "#007bff", color: "#fff", padding: "10px", textAlign: "center", fontWeight: 'bolder'}}>
                    <h3>RESET PASSWORD VIA EMAIL</h3>
                </div>
                <div style={{padding: "15px"}}>
                    <div style={{marginBottom: "15px"}}>
                        <div style={{background: "#d4edda", color: "#155724", padding: "10px", borderRadius: "0.25rem"}}>
                            <strong>Note:</strong> 
                            <br />
                            The URL will be sent to the email of saler and will be expired after 1 minute.
                        </div>
                    </div>
                    <div>
                        <form>
                            <div style={{marginBottom: "25px"}}>
                                <label style={{marginRight: "10px", color: "white", marginTop: "5px"}}>Email address:</label>
                                <input 
                                    type="email" 
                                    style={{padding: "6px", width: "70%", borderRadius: "0.25rem", border: "1px solid #ced4da"}}
                                    placeholder="Enter email"
                                    id="email"
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div style={{textAlign: "center"}}>
                                <div style={{display: "inline-block"}}>
                                    <button 
                                        onClick={(e) => handleResendEmail(e)}
                                        type="submit"
                                        style={{padding: "10px 20px", backgroundColor: "#28a745", color: "#000", borderRadius: "0.25rem", border: "none"}}
                                        disabled={status}
                                    >
                                        Submit
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            {(alert || error) && (
                <div style={{textAlign: "center", marginTop: "15px"}} className={`${error ? "error-message" : "success-message"}`}>
                    {error || alert}
                </div>
            )}
        </Fragment>
    );
}

export default ForgetPassword;
