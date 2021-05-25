import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  useAuth0,
  isAuthenticated,
  withAuthenticationRequired,
} from "@auth0/auth0-react";
import Loading from "./Loading";

function DashBoard() {
  const { user, getAccessTokenSilently } = useAuth0();
  const [activate, setActivated] = useState(false);
  const [plan, setPlan] = useState({});
  const requestUrl=process.env.REACT_APP_DOMAIN+"plan/check"
  async function createNewProxpi(){
    $('#mmodal').modal('show')
  }
  async function checkActivation() {
    const tokenCA = await getAccessTokenSilently();
    await axios
      .post(
"/plan/check",
        {
          body: user,
        },

        { headers: { authorization: `Bearer ${tokenCA}` } }
      )
      .then((dataq) => {
        if (dataq.data.boolean == false) {
          setActivated(false);
        } else if (dataq.data.boolean == true) {
          setActivated(true);
          setPlan(dataq.data.user);
        }
      });
  }
  async function ActivateUser() {
    const token = await getAccessTokenSilently();
    await axios
      .post(
        "/plan/activate",
        {
          body: user,
        },
        { headers: { authorization: `Bearer ${token}` } }
      )
      .then((userdata) => {
        //console.log(userdata)
        setPlan(userdata.data);
        setActivated(true);
      });
  }
  useEffect(() => {
    checkActivation();
  }, []);
  console.log(plan);
  return (
    <>
    <div id="mmodal" class="modal" tabindex="-1">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Modal title</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
      <form>
  <div class="form-group">
    <label for="exampleInputEmail1">Email address</label>
    <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" />
    <small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone else.</small>
  </div>
  <div class="form-group">
    <label for="exampleInputPassword1">Password</label>
    <input type="password" class="form-control" id="exampleInputPassword1"/>
  </div>
  <div class="form-group form-check">
    <input type="checkbox" class="form-check-input" id="exampleCheck1"/>
    <label class="form-check-label" for="exampleCheck1">Check me out</label>
  </div>
  <button type="submit" class="btn btn-primary">Submit</button>
</form>

      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
        <button type="button" class="btn btn-primary">Save changes</button>
      </div>
    </div>
  </div>
</div>
      <div
        style={{
          margin: "2%",
          display: "flex",
          flexDirection: "row",
          padding: "7px 7px",
        }}
        class="jumbotron"
      >
        <div
          class="modal fade bd-example-modal-sm"
          tabindex="-1"
          role="dialog"
          aria-labelledby="mySmallModalLabel"
          aria-hidden="true"
        >
          <div class="modal-dialog modal-sm">
            <div class="modal-content">Your Account is Active.</div>
          </div>
        </div>
        <div style={{ marginTop: "auto", marginBottom: "auto" }}>
          <img
            width="80px"
            height="80px"
            style={{ borderRadius: "50%", marginTop: "auto" }}
            src={user.picture}
          />
        </div>
        <div>
          <h3 style={{ marginLeft: "10px" }}>{user.given_name}</h3>
          <h6 style={{ marginLeft: "10px" }}>Plan : {plan.plan}</h6>
          <div style={{ display: "flex", flexDirection: "row" }}>
            <h6 style={{ marginLeft: "10px" }}>Status:</h6>
            {activate ? (
              <h6
                style={{ marginLeft: "4px", color: "#3d9fcf" }}
                data-toggle="modal"
                data-target=".bd-example-modal-sm"
              >
                Activated
              </h6>
            ) : (
              <h6
                style={{ marginLeft: "4px", color: "#ff4d4d" }}
                onClick={ActivateUser}
              >
                Click to Activate
              </h6>
            )}
          </div>
        </div>
      </div>
      <div style={{display:"flex",flexDirection:"row"}}>
      <h5 style={{ margin: "2%" }}>Your ProxPies</h5>
      <button onClick={createNewProxpi} class="btn btn-outline-primary">Create New</button>
      </div>
      <div
        style={{
          margin: "2%",
          display: "flex",
          flexDirection: "row",
          padding: "7px 7px",
        }}
        class="jumbotron"
      >
        
      </div>
    </>
  );
}
export default withAuthenticationRequired(DashBoard, {
  onRedirecting: () => <Loading />,
  returnTo: "/dashboard",
});
