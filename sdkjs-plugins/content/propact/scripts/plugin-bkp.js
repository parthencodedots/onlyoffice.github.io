/**
 *
 * (c) Copyright Ascensio System SIA 2020
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */
(function (window, undefined) {

    /**
     * @constant
     * @description Define the variables for HTML show/hide & enabled/disabled
     */
    var displayNoneClass = "d-none";
    var disabledClass = "disabled";
    var displayedInvitecpPending = "displayed-invitecp-pending";
    var displayedInviteCP = "displayed-invitecp";

    /**
     * @constant
     * @description Define the Path
     */
    var baseUrl = 'http://localhost:3003';
    var apiBaseUrl = baseUrl + '/api/v1/app';
    var IMAGE_USER_PATH_LINK = 'https://propact.s3.amazonaws.com/';

    /**
     * @constant
     * @description Defined the variables related to contract
     */
    var authToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NWRlYzFlZDEzMTE2ZjY2MzY3MmM5NGIiLCJjb21wYW55SWQiOiI2NWRlYzFlZDEzMTE2ZjY2MzY3MmM5NGQiLCJjb21wYW55TmFtZSI6IkFCQyIsInVzZXJSb2xlIjoiQWRtaW4iLCJmaXJzdE5hbWUiOiJNaXJhbGkiLCJsYXN0TmFtZSI6IkNoYXVoYW4iLCJlbWFpbCI6Im1pcmFsaS5lbmNvZGVkb3RzQGdtYWlsLmNvbSIsImltYWdlS2V5IjoiYXBwL3Byb2ZpbGUvSUVKSFcyMDI0MDMwMTA0NDIwMy5wbmciLCJzdHJpcGVDdXN0b21lcklkIjoiY3VzX1Blbng4UkhibFlJamZmIiwidG9rZW5Gb3IiOiJhcHAiLCJpYXQiOjE3MDk4OTY3NzksImV4cCI6MTcxMjQ4ODc3OX0.1Olbjq5ONMIPcuD4Lr_IdCW1yPDiSqGjaVImpqFllSA';
    var contractID = '65e1619244539624590d1516';
    var contractMode = '';
    var splitArray;

    /**
     * @constant
     * @description Define the variables for plugin setting
     */
    var flagInit = false;
    var flagDisableWhenPluginLoading = false;
    var flagSocketInit = false;

    /**
     * @constant
     * @description Defined the variables related to clause lists
     */
    var contractInformation = {};
    var loggedInUserDetails;
    var counterPartyDetail;
    var counterPartyCompanyDetail;
    var clauseLists = [];
    var selectedClauseID = '';

    /**
     * @constant
     * @description Define the variables for socket functionality
     */
    var socket = '';


    /**
     * @constant
     * @type {{loader: HTMLElement, error: HTMLElement, libLoader: HTMLElement}}
     * @description Defined all the HTML element
     */
    var elements = {
        loader: document.getElementById("loader"),

        btnCreateClause: document.getElementById("btnCreateClause"),
        btnMarkupMode: document.getElementById("btnMarkupMode"),
        btnInviteCounterparty: document.getElementById("btnInviteCounterparty"),
        btnInviteCounterpartyCancel: document.getElementById("btnInviteCounterpartyCancel"),
        btnResendInvitation: document.getElementById("btnResendInvitation"),
        btnCancelInvitation: document.getElementById("btnCancelInvitation"),

        paragraphInvitationActions: document.getElementById("paragraphInvitationActions"),

        formInviteCounterparty: document.getElementById("formInviteCounterparty"),

        sectionInviteCounterparty: document.getElementById("sectionInviteCounterparty"),
        sectionContractLists: document.getElementById("sectionContractLists"),

        divInviteCounterparty: document.getElementById("divInviteCounterparty"),
        divContractListItems: document.getElementById("divContractListItems"),
        divInviteCounterpartyInvited: document.getElementById("divInviteCounterpartyInvited"),

        txtOrganizationName: document.getElementById("txtOrganizationName"),
        txtCounterpartyName: document.getElementById("txtCounterpartyName"),
        txtCounterpartyEmail: document.getElementById("txtCounterpartyEmail"),

        snackbar: document.getElementById("snackbar"),
    }

    /**================================== Plugin Init Start ===============================*/
    window.Asc.plugin.init = function (text) {

        /**====================== Get & Set variables ======================*/
        contractID = getDocumentID(window.Asc.plugin.info.documentCallbackUrl);
        contractMode = getDocumentMode(window.Asc.plugin.info.documentCallbackUrl);
        splitArray = window.Asc.plugin.info.documentCallbackUrl.split('/');
        var authToken = splitArray[11];
        if (splitArray.length >= 13 && splitArray[12] != '0') {
            sectionID = splitArray[12];
        }
        if (splitArray.length >= 14 && splitArray[13] != '0') {
            chatWindows = splitArray[13];
        }
        /**====================== Get & Set variables ======================*/

        /**
         * @desc Get the open contract and user details
         */
        if (contractID && authToken && !flagInit) {
            getContractDetails(socket);
        }

        /**
         * @desc If text is not selected or contract is in markup mode than disable the create clause button
         */
        if (contractMode == 'markup') {
            switchClass(elements.btnCreateClause, displayNoneClass, true);
            elements.btnMarkupMode.innerHTML = 'Back to Contract';
        } else {
            switchClass(elements.btnCreateClause, displayNoneClass, false);
            switchClass(elements.btnCreateClause, disabledClass, true);
            elements.btnMarkupMode.innerHTML = 'Select Markup Mode';
            /*$('#clauseText').val(text);
            if (text) {
                document.getElementById('btnCreateClause').classList.remove(disabledClass);
            } else {
                if (!document.getElementById('btnCreateClause').classList.contains(disabledClass)) {
                    document.getElementById('btnCreateClause').classList.add(disabledClass);
                }
                /!*if (!document.getElementById('divContractCreate').classList.contains(displayNoneClass)) {
                    document.getElementById('divContractCreate').classList.add(displayNoneClass);
                    document.getElementById('divContractLists').classList.remove(displayNoneClass);
                }*!/
            }*/
            if (!flagDisableWhenPluginLoading) {
                var sDocumentEditingRestrictions = "readOnly";
                window.Asc.plugin.executeMethod("SetEditingRestrictions", [sDocumentEditingRestrictions]);
                flagDisableWhenPluginLoading = true;
            }
        }


    };
    /**================================== Plugin Init End =================================*/

    /**=========================== Plugin onMethodReturn Start ============================*/
    window.Asc.plugin.onMethodReturn = function (returnValue) {

    };
    /**=========================== Plugin onMethodReturn End ==============================*/

    /**================ Plugin event_onTargetPositionChanged Start ========================*/
    window.Asc.plugin.event_onTargetPositionChanged = function () {

    };
    /**================== Plugin event_onTargetPositionChanged End ========================*/




    if (!flagSocketInit) {
        var socket = io.connect(baseUrl,
            { auth: { authToken } }
        );
        flagSocketInit = true;
    }


    /**====================== Section: Contract Lists ======================*/
    elements.btnCreateClause.onclick = function () {
        alert('Button Clicked: Select Markup Mode');
    };

    elements.btnMarkupMode.onclick = function () {
        var data = {
            chatRoomName: loggedInUserDetails._id + "_" + contractID,
            contractMode: contractMode == 'markup' ? 'edit' : 'markup'
        }
        socket.emit('switchContractMode', data);
    };

    elements.btnInviteCounterparty.onclick = function () {
        switchClass(elements.sectionContractLists, displayNoneClass, true);
        switchClass(elements.sectionInviteCounterparty, displayNoneClass, false);
    };

    elements.btnResendInvitation.onclick = function () {
        switchClass(elements.loader, displayNoneClass, false);
        resendInvitation();
    }

    elements.btnCancelInvitation.onclick = function () {
        switchClass(elements.loader, displayNoneClass, false);
        cancelInvitation();
    }
    /**====================== Section: Contract Lists ======================*/


    /**====================== Section: Invite Counterparty ======================*/
    $("#formInviteCounterparty").validate({
        submitHandler: function (form) {
            switchClass(elements.loader, displayNoneClass, false);
            inviteCounterparties();
        }
    });

    elements.btnInviteCounterpartyCancel.onclick = function () {
        $("#formInviteCounterparty").validate().resetForm();
        elements.formInviteCounterparty.reset();
        switchClass(elements.sectionContractLists, displayNoneClass, false);
        switchClass(elements.sectionInviteCounterparty, displayNoneClass, true);
    }
    /**====================== Section: Invite Counterparty ======================*/


    /**================== Other Function Start ========================*/
    /**
     * @param url
     * @returns {*|string}
     */
    function getDocumentID(url) {
        var urlArr = url.split('/');
        return urlArr[8];
    }

    /**
     * @param url
     * @returns {*|string}
     */
    function getDocumentMode(url) {
        var urlArr = url.split('/');
        return urlArr[10];
    }

    /**
     * @description Switch classes
     * @param el
     * @param className
     * @param add
     */
    function switchClass(el, className, add) {
        if (add) {
            el.classList.add(className);
        } else {
            el.classList.remove(className);
        }
    };

    /**================== Other Function End  =========================*/


    /**================== API Start  =========================*/
    /**
     * @description This function will used for get the contract details and did the initial view settings of the plugin after getting the response
     * @param socket
     * @param redirection
     */
    function getContractDetails(socket, redirection = true) {
        try {
            let requestURL = apiBaseUrl + '/contract/get-open-contract-detail/' + contractID;
            var headers = {
                "Content-Type": "application/json"
            };
            if (authToken) headers["Authorization"] = 'Bearer ' + authToken;
            fetch(requestURL, {headers: headers})
                .then(response => response.json())
                .then(res => {
                    var response = res;
                    if (response && response.status == true && response.code == 200 && response.data) {
                        var responseData = res.data;
                        var contractInformation = responseData.openContractDetails;
                        loggedInUserDetails = responseData.loggedInUserDetails;
                        if (contractInformation.counterPartyInviteStatus !== 'Pending') {
                            counterPartyDetail = responseData.oppositeUser;
                        }
                        if (contractInformation.counterPartyInviteStatus == 'Accepted') {
                            counterPartyCompanyDetail = responseData.oppositeCompanyDetails;
                            if (contractMode !== 'markup') {
                                if (typeof window.Asc.plugin.executeMethod === 'function') {
                                    var sDocumentEditingRestrictions = "readOnly";
                                    window.Asc.plugin.executeMethod("SetEditingRestrictions", [sDocumentEditingRestrictions]);
                                }
                            }
                        }
                        if (contractInformation.userWhoHasEditAccess && contractInformation.userWhoHasEditAccess == loggedInUserDetails._id && responseData.contractCurrentState == 'Edit') {
                            if (typeof window.Asc.plugin.executeMethod === 'function') {
                                var sDocumentEditingRestrictions = "none";
                                window.Asc.plugin.executeMethod("SetEditingRestrictions", [sDocumentEditingRestrictions]);
                            }
                        }
                        var flagInit = true;
                        if (selectedClauseID) {
                            // TODO: Set tooltip based on loggedin user roles
                            /*var getClauseDetails = clauseLists.find((ele) => ele._id == selectedClauseID);
                            if (contractInformation && responseData.canSendPositionConfirmation && getClauseDetails && getClauseDetails.isSectionInDraftMode) {
                                if (contractInformation.userWhoHasEditAccess == loggedInUserDetails._id || responseData.userRole == "Counterparty" || responseData.userRole == "Contract Creator" || responseData.userRole == "Admin") {
                                    document.getElementById('toggleSendPositionConfirmationA').setAttribute('title', 'Send for Draft Confirmation');
                                } else {
                                    document.getElementById('toggleSendPositionConfirmationA').setAttribute('title', 'Send for Position Confirmation');
                                }
                            } else {
                                document.getElementById('toggleSendPositionConfirmationA').setAttribute('title', 'Send for Position Confirmation');
                            }*/
                        } else {
                            // TODO: Set tooltip based on loggedin user roles
                            // document.getElementById('toggleSendPositionConfirmationA').setAttribute('title', 'Send for Position Confirmation');
                        }
                        document.title = "ProPact | " + loggedInUserDetails.firstName + " " + loggedInUserDetails.lastName + " " + responseData.userRole;
                        if (loggedInUserDetails) {
                            // TODO: Set logged in user images in details screen
                            /*document.getElementById('userProfileImage').src = responseData.data.loggedInUserDetails.imageUrl ? responseData.data.loggedInUserDetails.imageUrl : 'images/no-profile-image.jpg';
                            document.getElementById('userProfileImageA').src = responseData.data.loggedInUserDetails.imageUrl ? responseData.data.loggedInUserDetails.imageUrl : 'images/no-profile-image.jpg';
                            document.getElementById('userProfileName').textContent = responseData.data.loggedInUserDetails.firstName + " " + responseData.data.loggedInUserDetails.lastName;
                            document.getElementById('userProfileNameA').innerHTML = responseData.data.loggedInUserDetails.firstName + " " + responseData.data.loggedInUserDetails.lastName + '<img src="images/icon-info.png" class="img-info">';
                            document.getElementById('userProfilerole').textContent = responseData.data.loggedInUserDetails.role;
                            document.getElementById('userProfileroleA').textContent = responseData.data.loggedInUserDetails.role;*/
                        }
                        if (contractMode != 'markup') {
                            // TODO: get contract Team and User List
                            // getContractTeamAndUserList();
                        }

                        if (contractInformation.counterPartyInviteStatus == 'Accepted') {
                            switchClass(elements.divInviteCounterparty, displayNoneClass, true);
                        } else if (contractInformation.counterPartyInviteStatus == 'Invited') {
                            if (!(responseData.userRole == 'Admin' || responseData.userRole == 'Contract Creator')) {
                                switchClass(elements.paragraphInvitationActions, displayNoneClass, true);
                            }
                            switchClass(elements.divInviteCounterparty, displayNoneClass, true);
                            switchClass(elements.divInviteCounterpartyInvited, displayNoneClass, false);
                            switchClass(elements.divContractListItems, displayedInviteCP, true);
                            switchClass(elements.divContractListItems, displayedInvitecpPending, false);
                            elements.txtOrganizationName.textContent = contractInformation.invitedOrgName;
                            elements.txtCounterpartyName.textContent = counterPartyDetail.firstName + " " + counterPartyDetail.lastName + " - Counterparty";
                            elements.txtCounterpartyEmail.textContent = counterPartyDetail.email;
                            // TODO: Pending
                            /*if (redirection) {
                                document.getElementById('btnMarkupMode').classList.add(displayNoneClass);
                                $('#btnMarkupMode').parent().addClass('justify-content-end');
                                document.getElementById('divContractLists').classList.remove(displayNoneClass);
                                if (documentMode != 'markup') {
                                    getContractTeamAndUserList();
                                }
                                clauseNextPage = 1;
                                clauseHasNextPage = true;
                                clauseLists = [];
                                getContractSectionList();
                            }
                            document.getElementById('btnGoToCounterparty').classList.add(displayNoneClass);
                            document.getElementById('btnGoToCounterpartyA').classList.add(displayNoneClass);
                            $('#chatFooterInner').addClass('justify-content-end');*/
                        } else if (contractInformation.counterPartyInviteStatus == 'Pending') {
                            switchClass(elements.divInviteCounterparty, displayNoneClass, false);
                            switchClass(elements.divContractListItems, displayedInviteCP, true);
                            switchClass(elements.divContractListItems, displayedInvitecpPending, false);
                            if (!(responseData.userRole == 'Admin' || responseData.userRole == 'Contract Creator')) {
                                switchClass(elements.btnInviteCounterparty, disabledClass, true);
                            }
                            // TODO: Counterparty button show/hide and other logic's needed here
                            /*document.getElementById('btnGoToCounterparty').classList.add(displayNoneClass);
                            document.getElementById('btnGoToCounterpartyA').classList.add(displayNoneClass);
                            $('#chatFooterInner').addClass('justify-content-end');
                            if (documentMode != 'markup') {
                                getContractTeamAndUserList();
                            }
                            if (redirection) {
                                document.getElementById('btnMarkupMode').classList.add(displayNoneClass);
                                $('#btnMarkupMode').parent().addClass('justify-content-end');
                                document.getElementById('divContractLists').classList.remove(displayNoneClass);
                                if (documentMode != 'markup') {
                                    getContractTeamAndUserList();
                                }
                                clauseNextPage = 1;
                                clauseHasNextPage = true;
                                clauseLists = [];
                                getContractSectionList();
                            }*/
                        }
                    } else {
                        console.log('Error: 14031200', 'Contract details not found');
                    }
                })
                .catch(function (err) {
                    console.log('Error #14031301:', err);
                });
        } catch (error) {
            console.log('Error #14031431:', error);
        }
    }

    /**
     * @description This function will used for send the invitation to join the contract as counterparty
     */
    function inviteCounterparties() {
        var form = elements.formInviteCounterparty;

        const urlencoded = new URLSearchParams();
        urlencoded.append("contractId", contractID);
        urlencoded.append("firstName", form.elements['firstName'].value);
        urlencoded.append("lastName", form.elements['lastName'].value);
        urlencoded.append("email", form.elements['email'].value);
        urlencoded.append("organisationName", form.elements['organisationName'].value);

        let requestURL = apiBaseUrl + '/contract/invite-contract-counterparty';
        var headers = {
            "Content-Type": "application/x-www-form-urlencoded"
        };
        var requestOptions = {
            method: 'POST',
            headers: headers,
            body: urlencoded
        };
        if (authToken) headers["Authorization"] = 'Bearer ' + authToken;
        fetch(requestURL, requestOptions)
            .then(response => response.json())
            .then(response => {
                // Handle the response data
                var responseData = response;
                if (responseData && responseData.status == true && responseData.code == 201) {
                    elements.formInviteCounterparty.reset();
                    switchClass(elements.divInviteCounterpartyInvited, displayNoneClass, false);
                    switchClass(elements.sectionInviteCounterparty, displayNoneClass, true);
                    switchClass(elements.sectionContractLists, displayNoneClass, false);
                    switchClass(elements.divContractListItems, displayedInvitecpPending, true);
                    switchClass(elements.divContractListItems, displayedInviteCP, false);
                    getContractDetails();
                } else if (responseData && responseData.status == false && responseData.message) {
                    $('#inviteEmailAddress').parent().append('<label class="error api-error">' + responseData.message + '</label>');
                }
                // TODO: Socket configuration required
                /*var data = {
                    chatRoomName: loggedInUserDetails.userWebId + "_" + documentID,
                    documentMode: documentMode
                }
                socket.emit('switch_document_mode', data);*/
                switchClass(elements.loader, displayNoneClass, true);
            })
            .catch(error => {
                // Handle any errors
                console.log('Error #14031455:', error);
                switchClass(elements.loader, displayNoneClass, true);
            });
    }

    /**
     * @description This function will used for resend the invitation to join this contract as counterparty
     */
    function resendInvitation() {
        try {
            let requestURL = apiBaseUrl + '/contract/resend-couterparty-invite/' + contractID;
            var headers = {
                "Content-Type": "application/json"
            };
            if (authToken) headers["Authorization"] = 'Bearer ' + authToken;
            fetch(requestURL, {headers: headers})
                .then(response => response.json())
                .then(response => {
                    // Handle the response data
                    var responseData = response;
                    if (responseData && responseData.status == true && responseData.code == 200) {
                        elements.snackbar.textContent = responseData.message;
                        elements.snackbar.className = "show";
                        setTimeout(function () {
                            elements.snackbar.classList.remove('show');
                        }, 3000)
                    }
                    switchClass(elements.loader, displayNoneClass, true);
                })
                .catch(error => {
                    // Handle any errors
                    console.log('Error #14031455:', error);
                    switchClass(elements.loader, displayNoneClass, true);
                });
        } catch (error) {
            console.log('Error #14031440:', error);
        }
    }

    /**
     * @description This function will used for cancelled the sent invitation
     */
    function cancelInvitation() {
        try {
            let requestURL = apiBaseUrl + '/contract/cancel-couterparty-invite/' + contractID;
            var headers = {
                "Content-Type": "application/json"
            };
            if (authToken) headers["Authorization"] = 'Bearer ' + authToken;
            fetch(requestURL, {headers: headers})
                .then(response => response.json())
                .then(response => {
                    // Handle the response data
                    var responseData = response;
                    if (responseData && responseData.status == true && responseData.code == 200) {
                        elements.snackbar.textContent = responseData.message;
                        elements.snackbar.className = "show";
                        setTimeout(function () {
                            elements.snackbar.classList.remove('show');
                        }, 3000)
                        switchClass(elements.divInviteCounterpartyInvited, displayNoneClass, true)
                        switchClass(elements.divInviteCounterparty, displayNoneClass, false)
                        switchClass(elements.divContractListItems, displayedInvitecpPending, false)
                        switchClass(elements.divContractListItems, displayedInviteCP, true);
                    }
                    switchClass(elements.loader, displayNoneClass, true);
                })
                .catch(error => {
                    // Handle any errors
                    console.log('Error #14031455:', error);
                    switchClass(elements.loader, displayNoneClass, true);
                });
        } catch (error) {
            console.log('Error #14031505:', error);
        }
    }

    /**================== API End  =========================*/


})(window, undefined);
