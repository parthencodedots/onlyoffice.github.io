$(document).ready(function () {

    let displayNoneClass = 'd-none';
    let disabledClass = 'disabled';
    let baseUrl = 'http://192.168.1.38:3003';
    let apiBaseUrl = baseUrl + '/api/v1/app';
    let documentID = '65e1619244539624590d1516';
    let documentMode;
    let splitArray;
    let authToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NWRlYzFlZDEzMTE2ZjY2MzY3MmM5NGIiLCJjb21wYW55SWQiOiI2NWRlYzFlZDEzMTE2ZjY2MzY3MmM5NGQiLCJjb21wYW55TmFtZSI6IkFCQyIsInVzZXJSb2xlIjoiQWRtaW4iLCJmaXJzdE5hbWUiOiJNaXJhbGkiLCJsYXN0TmFtZSI6IkNoYXVoYW4iLCJlbWFpbCI6Im1pcmFsaS5lbmNvZGVkb3RzQGdtYWlsLmNvbSIsImltYWdlS2V5IjoiYXBwL3Byb2ZpbGUvSUVKSFcyMDI0MDMwMTA0NDIwMy5wbmciLCJzdHJpcGVDdXN0b21lcklkIjoiY3VzX1Blbng4UkhibFlJamZmIiwidG9rZW5Gb3IiOiJhcHAiLCJpYXQiOjE3MDk4NzM4NjcsImV4cCI6MTcxMjQ2NTg2N30.u1o2_iI5ViWDx0WPZEp6TMX0Jh39yA1PewOUB1zuxU8';
    let sectionID;
    let chatWindows;

    /**================ Section Contract Lists Start ========================*/
    $('#btnInviteCounterpartyForm').on('click', function () {
        $('#sectionContractLists').addClass(displayNoneClass);
        $('#divInviteCounterparty').addClass(displayNoneClass);
        $('#sectionInviteCounterparty').removeClass(displayNoneClass);
    })

    if (documentMode == 'markup') {
        document.getElementById('btnCreateClause').classList.add(displayNoneClass);
        document.getElementById('btnMarkupMode').innerHTML = "Master Document";
    } else {
        document.getElementById('btnCreateClause').classList.remove(displayNoneClass);
        document.getElementById('btnCreateClause').classList.add(disabledClass);
        document.getElementById('btnMarkupMode').innerHTML = "Our Working Draft";
    }
    /**================ Section Contract Lists End ========================*/


    /*window.Asc.plugin.init = function (text) {
        /!**====================== Get & Set variables ======================*!/
        documentID = getDocumentID(window.Asc.plugin.info.documentCallbackUrl);
        documentMode = getDocumentMode(window.Asc.plugin.info.documentCallbackUrl);
        splitArray = window.Asc.plugin.info.documentCallbackUrl.split('/');
        authToken = splitArray[11];
        if (splitArray.length >= 13 && splitArray[12] != '0') {
            sectionID = splitArray[12];
        }
        if (splitArray.length >= 14 && splitArray[13] != '0') {
            chatWindows = splitArray[13];
        }
        /!**====================== Get & Set variables ======================*!/
    }*/

    // Section Invite CounterParty
    /**
     * Invite Counterparties form submit
     */
    $("#inviteForm").validate({
        submitHandler: function (form) {
            // $(form).ajaxSubmit();
            inviteCounterparties();
        }
    });

    function inviteCounterparties() {
        try {
            $('#mainLoader').removeClass(displayNoneClass);

            // Create an object to store form data
            const urlencoded = new URLSearchParams();
            urlencoded.append("contractId", documentID);
            urlencoded.append("firstName", $('input[name="firstName"]').val());
            urlencoded.append("lastName", $('input[name="lastName"]').val());
            urlencoded.append("email", $('input[name="email"]').val());
            urlencoded.append("organisationName", $('input[name="organisationName"]').val());

            var inviteCounterpartiesUrl = apiBaseUrl + '/contract/invite-contract-counterparty';

            var headers = {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Bearer ' + authToken
            };
            var requestOptions = {
                method: 'POST',
                headers: headers,
                body: urlencoded
            };
            fetch(inviteCounterpartiesUrl, requestOptions)
                .then(response => response.json())
                .then(data => {
                    /*// Handle the response data
                    document.getElementById('mainLoader').classList.remove(displayNoneClass);
                    var responseData = data;
                    if (responseData && responseData.status == true && responseData.code == 200) {
                        document.getElementById('mainLoader').classList.add(displayNoneClass);
                        document.getElementById("inviteForm").reset();
                        document.getElementById('divInviteCounterpartyPending').classList.remove(displayNoneClass);
                        document.getElementById('divInviteCounterpartyForm').classList.add(displayNoneClass);
                        document.getElementById('contractListItemsDiv').classList.add('displayed-invitecp-pending');
                        document.getElementById('contractListItemsDiv').classList.remove('displayed-invitecp');
                        getOpenContractUserDetails();
                    } else if (responseData && responseData.status == false && responseData.message) {
                        $('#inviteEmailAddress').parent().append('<label class="error api-error">' + responseData.message + '</label>');
                        document.getElementById('mainLoader').classList.add(displayNoneClass);
                    }
                    var data = {
                        chatRoomName: loggedInUserDetails.userWebId + "_" + documentID,
                        documentMode: documentMode
                    }
                    socket.emit('switch_document_mode', data);*/
                })
                .catch(error => {
                    // Handle any errors
                    console.error('Error:', error);
                    document.getElementById('mainLoader').classList.add(displayNoneClass);
                });
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    /**
     * Invite Counterparties Cancel Button
     */
    $("#btnInviteCounterpartyCancel").click(function () {
        $("#inviteForm").validate().resetForm();
        $("#inviteForm")[0].reset();
        let apiError = document.getElementsByClassName("api-error");
        for (var i = 0; i < apiError.length; i++) {
            var label = apiError[i];
            label.innerHTML = ""; // Remove content
            label.classList.remove("label"); // Remove class
        }
        $('#divInviteCounterparty').removeClass(displayNoneClass);
        $('#sectionContractLists').removeClass(displayNoneClass);
        $('#sectionInviteCounterparty').addClass(displayNoneClass);
    })
    // Section Invite CounterParty


    // Common function
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

    // Common function

});
