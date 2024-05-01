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
    var baseUrl = 'https://apipropactv2.digitaldilemma.com.au:5004';
    var apiBaseUrl = baseUrl + '/api/v1/app';
    var IMAGE_USER_PATH_LINK = 'https://propact.s3.amazonaws.com/';

    /**
     * @constant
     * @description Defined the variables related to contract
     */
    var authToken = '';
    var contractID = '';
    var contractMode = '';
    var splitArray;
    var documentCallbackUrl = '';

    /**
     * @constant
     * @description Define the variables for plugin setting
     */
    var flagInit = false;
    var flagDisableWhenPluginLoading = false;
    var flagSocketInit = false;
    var flagRedirectFirst = false;
    var flagClickLabel = false;
    var flagRedirectClauseCreate = false;
    var flagSocketFunctionInit = false;

    /**
     * @constant
     * @description Defined the variables related to clause lists
     */
    var openContractResponseData = {};
    var contractInformation = {};
    var loggedInUserDetails;
    var loggedInCompanyDetails;
    var counterPartyDetail;
    var counterPartyCompanyDetail;
    var tagLists = [];
    var selectedThreadID = '';
    var selectedClauseID = '';
    var clauseChatWindows = '';
    var selectedInviteTeams = [];
    var selectedInviteUsers = [];
    var searchText = '';
    var searchTimeout;
    var clauseNextPage = 1;
    var clauseHasNextPage = true;
    var clauseLists = [];
    var sectionID = '';
    var chatWindows = '';
    var selectedContractSectionDetails = '';
    var tagUserInMessage = [];
    var contractCreatorDetails;
    var contractCounterPartyDetails;
    var chatHistoryNextPage = 1;
    var chatHistoryHasNextPage = true;
    var sameSideUserList = [];
    var counterpartyUserList = [];
    var tyingUserSSArray = [];
    var tyingUserCPArray = [];
    var typingTimeout;

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
        btnScrollDown: document.getElementById("btnScrollDown"),
        btnContractCreateClose: document.getElementById("btnContractCreateClose"),
        btnContractCreateCancel: document.getElementById("btnContractCreateCancel"),
        btnCloseConversionHistory: document.getElementById("btnCloseConversionHistory"),
        btnGoToCounterpartyChat: document.getElementById("btnGoToCounterpartyChat"),
        btnGoToCounterparty: document.getElementById("btnGoToCounterparty"),
        btnGoToSameSideChat: document.getElementById("btnGoToSameSideChat"),
        btnGoToSameSide: document.getElementById("btnGoToSameSide"),
        btnSendSameSide: document.getElementById("btnSendSameSide"),
        btnSendCounterParty: document.getElementById("btnSendCounterParty"),
        btnGoToConversionHistory: document.getElementById("btnGoToConversionHistory"),
        btnGoToConversionChatHistory: document.getElementById("btnGoToConversionChatHistory"),
        btnCloseSameSideChat: document.getElementById("btnCloseSameSideChat"),
        btnCloseCounterpartyChat: document.getElementById("btnCloseCounterpartyChat"),
        btnSendPositionConfirmationSameSide: document.getElementById("btnSendPositionConfirmationSameSide"),
        btnSendPositionConfirmationCounterparty: document.getElementById("btnSendPositionConfirmationCounterparty"),
        btnOpenInviteUserTeam: document.getElementById("btnOpenInviteUserTeam"),
        btnScheduleMeetingSameSide: document.getElementById("btnScheduleMeetingSameSide"),
        btnWithdrawnClauseSameSide: document.getElementById("btnWithdrawnClauseSameSide"),
        btnInviteUsers: document.getElementById("btnInviteUsers"),
        btnInviteTeams: document.getElementById("btnInviteTeams"),
        btnScheduleMeetingCounterparty: document.getElementById("btnScheduleMeetingCounterparty"),
        btnMeetingView: document.getElementById("btnMeetingView"),
        btnMeetingEnterOutcomes: document.getElementById("btnMeetingEnterOutcomes"),
        btnMeetingViewOutcomes: document.getElementById("btnMeetingViewOutcomes"),

        paragraphInvitationActions: document.getElementById("paragraphInvitationActions"),
        paragraphTeamsNotFoundMessage: document.getElementById("paragraphTeamsNotFoundMessage"),
        paragraphUsersNotFoundMessage: document.getElementById("paragraphUsersNotFoundMessage"),

        formInviteCounterparty: document.getElementById("formInviteCounterparty"),
        formClause: document.getElementById("formClause"),
        formSendPositionConfirmation: document.getElementById("formSendPositionConfirmation"),
        formReconfirmPosition: document.getElementById("formReconfirmPosition"),
        formRejectPosition: document.getElementById("formRejectPosition"),
        formAssignDraftRequest: document.getElementById("formAssignDraftRequest"),
        formSendDraftConfirmation: document.getElementById("formSendDraftConfirmation"),
        formRejectDraftRequest: document.getElementById("formRejectDraftRequest"),
        formRejectDraft: document.getElementById("formRejectDraft"),
        formMeetingOutcomes: document.getElementById("formMeetingOutcomes"),

        sectionContractLists: document.getElementById("sectionContractLists"),
        sectionInviteCounterparty: document.getElementById("sectionInviteCounterparty"),
        sectionCreateClause: document.getElementById("sectionCreateClause"),
        sectionConversionHistory: document.getElementById("sectionConversionHistory"),
        sectionSameSideChat: document.getElementById("sectionSameSideChat"),
        sectionCounterpartyChat: document.getElementById("sectionCounterpartyChat"),

        divInviteCounterparty: document.getElementById("divInviteCounterparty"),
        divContractListItems: document.getElementById("divContractListItems"),
        divInviteCounterpartyInvited: document.getElementById("divInviteCounterpartyInvited"),
        divInviteUsersBox: document.getElementById("divInviteUsersBox"),
        divInvitedUsers: document.getElementById("divInvitedUsers"),
        divInvitedTeams: document.getElementById("divInvitedTeams"),
        divInviteUserTabs: document.getElementById("divInviteUserTabs"),
        divSameSideTextbox: document.getElementById("divSameSideTextbox"),
        divCounterpartyTextbox: document.getElementById("divCounterpartyTextbox"),
        divChatHistoryBody: document.getElementById("divChatHistoryBody"),
        divChatSameSideBody: document.getElementById("divChatSameSideBody"),
        divChatCounterPartyBody: document.getElementById("divChatCounterPartyBody"),
        divChatContractSameSideFooter: document.getElementById("divChatContractSameSideFooter"),
        divChatContractCounterpartyFooter: document.getElementById("divChatContractCounterpartyFooter"),
        divContractCounterpartySection: document.getElementById("divContractCounterpartySection"),
        divDraftingBox: document.getElementById("divDraftingBox"),
        divMeetingViewOutcomes: document.getElementById("divMeetingViewOutcomes"),
        divMeetingEnterOutcomes: document.getElementById("divMeetingEnterOutcomes"),

        approvePositionMessageId: document.getElementById("approvePositionMessageId"),
        assignDraftingRequestUserId: document.getElementById("assignDraftingRequestUserId"),
        assignDraftingRequestInput: document.getElementById("assignDraftingRequestInput"),
        assignDraftingRequestBox: document.getElementById("assignDraftingRequestBox"),
        assignDraftRequestBox: document.getElementById("assignDraftRequestBox"),
        accordionAssignDraftRequest: document.getElementById("accordionAssignDraftRequest"),
        accordionPositionConfirmation: document.getElementById("accordionPositionConfirmation"),
        sendAssignDraftRequest: document.getElementById("sendAssignDraftRequest"),
        sendReconfirmPosition: document.getElementById("sendReconfirmPosition"),
        sendToTeamForDraft: document.getElementById("sendToTeamForDraft"),
        assignDraftRequestMessageId: document.getElementById("assignDraftRequestMessageId"),
        assignDraftRequestUserId: document.getElementById("assignDraftRequestUserId"),

        txtOrganizationName: document.getElementById("txtOrganizationName"),
        txtCounterpartyName: document.getElementById("txtCounterpartyName"),
        txtCounterpartyEmail: document.getElementById("txtCounterpartyEmail"),
        txtMeetingViewOutcomes: document.getElementById("txtMeetingViewOutcomes"),

        inputInviteUsersTeams: document.getElementById("inputInviteUsersTeams"),
        chkboxInviteAllTeams: document.getElementById("chkboxInviteAllTeams"),
        chkboxInviteAllUsers: document.getElementById("chkboxInviteAllUsers"),
        inputSearchbox: document.getElementById("inputSearchbox"),
        inputSendPositionConfirmation: document.getElementById("inputSendPositionConfirmation"),
        inputRejectPositionReason: document.getElementById("inputRejectPositionReason"),
        inputRejectDraftReason: document.getElementById("inputRejectDraftReason"),
        inputAssignDraftRequest: document.getElementById("inputAssignDraftRequest"),
        inputSendDraftConfirmation: document.getElementById("inputSendDraftConfirmation"),
        rejectDraftMessageId: document.getElementById("rejectDraftMessageId"),

        accordionBodyTeams: document.getElementById("accordionBodyTeams"),
        accordionBodyUsers: document.getElementById("accordionBodyUsers"),
        conversionHistory: document.getElementById("conversionHistory"),
        conversionSameSide: document.getElementById("conversionSameSide"),
        conversionCounterparty: document.getElementById("conversionCounterparty"),
        userProfileName: document.getElementById("userProfileName"),
        imgInviteUserTeam: document.getElementById("imgInviteUserTeam"),
        counterpartyUserProfileName: document.getElementById("counterpartyUserProfileName"),

        snackbar: document.getElementById("snackbar"),

        inviteUserPopup: document.getElementById("inviteUserPopup"),
        inviteTeamPopup: document.getElementById("inviteTeamPopup"),
        sendPositionConfirmationPopup: document.getElementById("sendPositionConfirmationPopup"),
        confirmPositionPopup: document.getElementById("confirmPositionPopup"),
        rejectPositionPopup: document.getElementById("rejectPositionPopup"),
        assignDraftRequestPopup: document.getElementById("assignDraftRequestPopup"),
        sendDraftConfirmationPopup: document.getElementById("sendDraftConfirmationPopup"),
        rejectDarftRequestPopup: document.getElementById("rejectDarftRequestPopup"),
        rejectDarftPopup: document.getElementById("rejectDarftPopup"),
        meetingPopup: document.getElementById("meetingPopup"),

        messageInputCounterParty: document.getElementById("messageInputCounterParty"),
        messageInputSameSide: document.getElementById("messageInputSameSide"),
        chatFooterInnerSameSide: document.getElementById("chatFooterInnerSameSide"),

        allUserInvitedMessage: document.getElementById("allUserInvitedMessage"),
        noUserInviteListMessage: document.getElementById("noUserInviteListMessage"),
        partiallyInvitedUserListMessage: document.getElementById("partiallyInvitedUserListMessage"),
        sendInviteUsers: document.getElementById("sendInviteUsers"),
        inviteUserTable: document.getElementById("inviteUserTable"),
        allTeamInvitedMessage: document.getElementById("allTeamInvitedMessage"),
        noTeamInviteListMessage: document.getElementById("noTeamInviteListMessage"),
        partiallyInvitedTeamListMessage: document.getElementById("partiallyInvitedTeamListMessage"),
        sendInviteTeams: document.getElementById("sendInviteTeams"),
        inviteTeamTable: document.getElementById("inviteTeamTable"),
        rejectPositionMessageId: document.getElementById("rejectPositionMessageId"),

        typingSpan: document.getElementById("typingSpan"),
        typingSpanCP: document.getElementById("typingSpanCP"),

        meetingTitle: document.getElementById("meetingTitle"),
        meetingLocation: document.getElementById("meetingLocation"),
        meetingAgenda: document.getElementById("meetingAgenda"),
        meetingScheduleTime: document.getElementById("meetingScheduleTime"),
        MeetingTimings: document.getElementById("MeetingTimings"),
        participantCounts: document.getElementById("participantCounts"),
        meetingParticipantList: document.getElementById("meetingParticipantList"),

    }

    /**================================== Plugin Init Start ===============================*/
    window.Asc.plugin.init = function (text) {

        //event "init" for plugin
        window.Asc.plugin.executeMethod("ShowButton", ["back", false]);
        window.Asc.plugin.executeMethod("GetAllContentControls");

        if (window.Asc.plugin.info && typeof window.Asc.plugin.info.documentCallbackUrl == 'string') {
            documentCallbackUrl = window.Asc.plugin.info.documentCallbackUrl;
        }

        /**====================== Get & Set variables ======================*/
        contractID = getContractID(documentCallbackUrl);
        contractMode = getContractMode(documentCallbackUrl);
        splitArray = documentCallbackUrl.split('/');
        authToken = splitArray[11];
        if (splitArray.length >= 13 && splitArray[12] != '0') {
            sectionID = splitArray[12];
        }
        if (splitArray.length >= 14 && splitArray[13] != '0') {
            chatWindows = splitArray[13];
        }
        /**====================== Get & Set variables ======================*/

        if (!flagSocketInit) {
            socket = io.connect(baseUrl,
                {auth: {authToken}}
            );
            flagSocketInit = true;
        }

        /**
         * @desc If text is not selected or contract is in markup mode than disable the create clause button
         */
        if (contractMode == 'markup') {
            switchClass(elements.btnCreateClause, displayNoneClass, true);
            elements.btnMarkupMode.innerHTML = 'Back to Contract';
        } else {
            if (contractInformation) {
                switchClass(elements.btnCreateClause, displayNoneClass, (contractInformation && contractInformation.contractCurrentStatus != "Under Negotiation"));
            } else {
                switchClass(elements.btnCreateClause, displayNoneClass, false);
            }
            switchClass(elements.btnCreateClause, disabledClass, true);
            elements.btnMarkupMode.innerHTML = 'Select Markup Mode';
            // $('#clauseText').val(text);
            if (text) {
                switchClass(elements.btnCreateClause, disabledClass, false);
            } else {
                if (!document.getElementById('btnCreateClause').classList.contains(disabledClass)) {
                    switchClass(elements.btnCreateClause, disabledClass, true);
                }
            }
            if (!flagDisableWhenPluginLoading) {
                if (typeof window.Asc.plugin.executeMethod === 'function') {
                    var sDocumentEditingRestrictions = "readOnly";
                    window.Asc.plugin.executeMethod("SetEditingRestrictions", [sDocumentEditingRestrictions]);
                }
                flagDisableWhenPluginLoading = true;
            }
        }

        /**
         * @desc Get the open contract and user details
         */
        if (contractID && authToken && !flagInit) {
            getContractDetails(socket);
        }

    };

    window.Asc.plugin.onMethodReturn = function (returnValue) {
        //event return for completed methods
        var _plugin = window.Asc.plugin;
        if (_plugin.info.methodName == "GetAllContentControls") {
            for (var i = 0; i < returnValue.length; i++) {
                var tagExists = tagLists.findIndex((ele) => +ele.Id == +returnValue[i].Id);
                if (tagExists < 0) {
                    tagLists.push(returnValue[i]);
                }
            }
        } else if (_plugin.info.methodName == "GetCurrentContentControl") {
            if (tagLists && tagLists.length > 0 && returnValue) {
                var selectedTag = tagLists.findIndex((ele) => ele.InternalId == returnValue);
                if (selectedTag > -1 && tagLists[selectedTag].Id && document.getElementById(tagLists[selectedTag].Id)) {
                    selectedCommentThereadID = tagLists[selectedTag].Tag;

                    $('.div-selected').removeClass('div-selected');
                    $('#divContractListItems #' + tagLists[selectedTag].Id).addClass('div-selected');
                }
            }
        }
    };

    window.Asc.plugin.event_onTargetPositionChanged = function () {
        if (!flagClickLabel) {
            window.Asc.plugin.executeMethod("GetCurrentContentControl");
        }
        flagClickLabel = false;
    };
    /**================================== Plugin Init End =================================*/


    /**====================== Get & Set variables ======================*/
    contractID = getURLParameter('contractID');
    contractMode = getContractMode('contractMode');
    splitArray = documentCallbackUrl.split('/');
    authToken = getURLParameter('authToken');
    if (splitArray.length >= 13 && splitArray[12] != '0') {
        sectionID = splitArray[12];
    }
    if (splitArray.length >= 14 && splitArray[13] != '0') {
        chatWindows = splitArray[13];
    }
    /**====================== Get & Set variables ======================*/

    if (!flagSocketInit) {
        socket = io.connect(baseUrl,
            {auth: {authToken}}
        );
        flagSocketInit = true;
    }

    /**
     * @desc Get the open contract and user details
     */
    if (contractID && authToken && !flagInit) {
        getContractDetails(socket);
    }
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

    /**====================== Section: Contract Lists ======================*/
    elements.btnCreateClause.onclick = function () {
        // alert('Button Clicked: Select Markup Mode');
        if (!elements.divInviteUsersBox.classList.contains(displayNoneClass)) {
            switchClass(elements.divInviteUsersBox, displayNoneClass, true);
        }
        // if (text) {
        switchClass(elements.sectionContractLists, displayNoneClass, true);
        switchClass(elements.sectionCreateClause, displayNoneClass, false);
        // }
    };

    elements.btnMarkupMode.onclick = function () {
        var data = {
            chatRoomName: loggedInUserDetails._id + "_" + contractID,
            contractMode: contractMode == 'markup' ? 'edit' : 'markup'
        };
        socket.emit('switchContractMode', data);
    };

    elements.btnInviteCounterparty.onclick = function () {
        switchClass(elements.sectionContractLists, displayNoneClass, true);
        switchClass(elements.sectionInviteCounterparty, displayNoneClass, false);
    };

    elements.btnResendInvitation.onclick = function () {
        switchClass(elements.loader, displayNoneClass, false);
        resendInvitation();
    };

    elements.btnCancelInvitation.onclick = function () {
        switchClass(elements.loader, displayNoneClass, false);
        cancelInvitation();
    };

    elements.btnMeetingViewOutcomes.onclick = function () {
        switchClass(elements.divMeetingViewOutcomes, displayNoneClass, !$('#divMeetingViewOutcomes').hasClass(displayNoneClass));
    }

    elements.btnMeetingEnterOutcomes.onclick = function () {
        switchClass(elements.divMeetingEnterOutcomes, displayNoneClass, !$('#divMeetingEnterOutcomes').hasClass(displayNoneClass));
    }

    elements.inputSearchbox.onkeyup = function (event) {
        clearTimeout(searchTimeout); // Clear any existing timeout
        searchTimeout = setTimeout(async function () {
            if (searchText != event.target.value.trim()) {
                elements.divContractListItems.innerHTML = '';
                searchText = event.target.value.trim();
                clauseNextPage = 1;
                clauseHasNextPage = true;
                clauseLists = [];
                await getClauses();
            } else {
                searchText = '';
                clauseNextPage = 1;
                clauseHasNextPage = true;
                clauseLists = [];
                await getClauses();
            }
        }, 500);
    };

    elements.divContractListItems.onscroll = async function (e) {
        if (elements.divContractListItems.scrollTop + elements.divContractListItems.offsetHeight >= (elements.divContractListItems.scrollHeight - 1)) {
            if (clauseHasNextPage) {
                await getClauses();
            } else {
                switchClass(elements.btnScrollDown, displayNoneClass, true);
            }
        } else {
            if (elements.divContractListItems.scrollHeight >= elements.divContractListItems.scrollTop + elements.divContractListItems.offsetHeight && clauseLists && clauseLists.length > 2) {
                switchClass(elements.btnScrollDown, displayNoneClass, false);
            } else {
                switchClass(elements.btnScrollDown, displayNoneClass, true);
            }
        }
    };

    elements.btnScrollDown.onclick = function () {
        $('#divContractListItems').animate({scrollTop: elements.divContractListItems.scrollHeight}, 'slow');
        return false;
    };

    $(document).on('click', '.contract-item', async function () {
        flagClickLabel = true;
        var actionSameSide = document.querySelectorAll('.action-sameside');
        actionSameSide.forEach(function (element) {
            element.classList.remove(displayNoneClass);
        });
        var actionCounterparty = document.querySelectorAll('.action-counterparty');
        actionCounterparty.forEach(function (element) {
            element.classList.remove(displayNoneClass);
        });
        var elementID = $(this).attr('id');
        var tagExists = tagLists.findIndex((ele) => +ele.Id == +elementID);
        // TODO: Remove or condition
        if (tagExists > -1 || 1) {
            selectedThreadID = $(this).data('commentid');
            selectedClauseID = $(this).data('id');
            clauseChatWindows = $(this).data('chatwindow');
            await getContractSectionDetails();
            if (!flagRedirectClauseCreate) {
                await getContractDetails(socket, redirection = false);
            }

            var conversionHistorySocketRoom = getChatRoom('Conversion History');
            socket.emit('joinContractSectionChatRoom', conversionHistorySocketRoom);

            var counterpartySocketRoom = getChatRoom('Counterparty');
            socket.emit('joinContractSectionChatRoom', counterpartySocketRoom);

            var sameSideSocketRoom = getChatRoom('Our Team');
            socket.emit('joinContractSectionChatRoom', sameSideSocketRoom);

            var draftConfirmSSElement = document.getElementById("draftConfirmSS");
            if (draftConfirmSSElement) {
                draftConfirmSSElement.parentNode.removeChild(draftConfirmSSElement);
            }
            var draftConfirmCPElement = document.getElementById("draftConfirmCP");
            if (draftConfirmCPElement) {
                draftConfirmCPElement.parentNode.removeChild(draftConfirmCPElement);
            }

            if (!flagRedirectClauseCreate) {
                await redirectToMessageScreen();
            } else {
                if (!(chatWindows == 'SS' || chatWindows == 'CP')) {
                    withType = 'Our Team';
                    messageConfirmationFor = 'Same Side';
                    elements.conversionSameSide.innerHTML = '';
                    chatNextPage = 1;
                    chatHasNextPage = true;
                    await getContractSectionMessageList('our');
                    var chatRoomName = getChatRoom(withType);
                    socket.emit('joinContractSectionChatRoom', chatRoomName);
                    elements.messageInputSameSide.value = "";
                    switchClass(elements.sectionContractLists, displayNoneClass, true);
                    switchClass(elements.sectionSameSideChat, displayNoneClass, false);
                    switchClass(elements.sectionCounterpartyChat, displayNoneClass, true);
                    switchClass(elements.sectionConversionHistory, displayNoneClass, true);
                }
            }
            switchClass(elements.sendPositionConfirmationPopup, displayNoneClass, true);
            elements.btnOpenInviteUserTeam.closest("li").classList.remove('active');
            if (typeof window.Asc.plugin.executeMethod === 'function') {
                window.Asc.plugin.executeMethod("SelectContentControl", [tagLists[tagExists].InternalId]);
            }
            switchClass(elements.btnGoToCounterpartyChat, displayNoneClass, false);
            switchClass(elements.btnGoToCounterparty, displayNoneClass, false);
            switchClass(elements.btnSendPositionConfirmationSameSide.closest("li"), displayNoneClass, false);
            document.getElementById('btnSendPositionConfirmationCounterparty').closest("li").classList.remove(displayNoneClass);
            switchClass(elements.chatFooterInnerSameSide, 'justify-content-end', false);
            if (!openContractResponseData.canCommunicateWithCounterparty) {
                switchClass(elements.btnGoToCounterpartyChat, displayNoneClass, true);
                switchClass(elements.btnGoToCounterparty, displayNoneClass, true);
                switchClass(elements.chatFooterInnerSameSide, 'justify-content-end', true);
            }
            if (openContractResponseData.canSendPositionConfirmation == false) {
                switchClass(elements.btnSendPositionConfirmationSameSide.closest("li"), displayNoneClass, true);
                document.getElementById('btnSendPositionConfirmationCounterparty').closest("li").classList.add(displayNoneClass);
            }
            if (contractInformation.counterPartyInviteStatus != 'Accepted') {
                switchClass(elements.btnGoToCounterpartyChat, displayNoneClass, true);
                switchClass(elements.btnGoToCounterparty, displayNoneClass, true);
                switchClass(elements.chatFooterInnerSameSide, 'justify-content-end', true);
            }
            if (!(openContractResponseData.userRole == "Counterparty" || openContractResponseData.userRole == "Admin" || openContractResponseData.userRole == "Contract Creator" || openContractResponseData.userRole == "Position Confirmer")) {
                switchClass(elements.btnWithdrawnClauseSameSide, displayNoneClass, true);
            } else {
                switchClass(elements.btnWithdrawnClauseSameSide, displayNoneClass, false);
            }
            await unreadMessageForThread();
            flagRedirectClauseCreate = false;
            /*var getClauseDetails = clauseLists.find((ele) => ele._id == selectedThreadID);
            if (getClauseDetails && getClauseDetails._id) {
                // await getSelectedContractSectionDetails();
                if (getClauseDetails.assignedUser && getClauseDetails.assignedUser.length > 0) {
                    var iHtml = '<ul>';
                    getClauseDetails.assignedUser.forEach((ele) => {
                        var userDetails = inviteUserListIDs.find((el) => el._id == ele._id);
                        if (userDetails) {
                            iHtml += '<li>\n' +
                                '\t\t\t\t<div class="invite-user-inner">\n' +
                                '\t\t\t\t\t\t\t\t<div class="invite-user-icon">\n' +
                                '\t\t\t\t\t\t\t\t\t\t\t\t<img src="' + (userDetails.userImage ? IMAGE_USER_PATH_LINK + userDetails.userImage : 'images/no-profile-image.jpg') + '" alt="">\n' +
                                '\t\t\t\t\t\t\t\t</div>\n' +
                                '\t\t\t\t\t\t\t\t<div class="invite-user-name">\n' +
                                '\t\t\t\t\t\t\t\t\t\t\t\t<h3>' + userDetails.itemName + '</h3>\n' +
                                '\t\t\t\t\t\t\t\t\t\t\t\t<span>' + userDetails.role + '</span>\n' +
                                '\t\t\t\t\t\t\t\t</div>\n' +
                                '\t\t\t\t</div>\n' +
                                '</li>';
                        }
                    });
                    iHtml += '</ul>';
                    document.getElementById('userTabContent').innerHTML = iHtml;
                } else {
                    var html = '<ul>' +
                        '<li><p>No user selected</p></li>' +
                        '</ul>';
                    document.getElementById('userTabContent').innerHTML = html;
                }
                if (getClauseDetails.assignedTeam && getClauseDetails.assignedTeam.length > 0) {
                    var iHtml = '<ul>';
                    getClauseDetails.assignedTeam.forEach((ele) => {
                        var teamDetails = inviteTeamListIDs.find((el) => el._id == ele._id);
                        if (teamDetails && teamDetails.itemName) {
                            iHtml += '<li>\n' +
                                '\t\t\t\t<div class="invite-user-inner">\n' +
                                '\t\t\t\t\t\t\t\t<div class="invite-user-name">\n' +
                                '\t\t\t\t\t\t\t\t\t\t\t\t<h3>' + teamDetails.itemName + '</h3>\n' +
                                '\t\t\t\t\t\t\t\t</div>\n' +
                                '\t\t\t\t</div>\n' +
                                '</li>';
                        }
                    });
                    iHtml += '</ul>';
                    document.getElementById('teamTabContent').innerHTML = iHtml;
                } else {
                    var html = '<ul>' +
                        '<li><p>No team selected</p></li>' +
                        '</ul>';
                    document.getElementById('teamTabContent').innerHTML = html;
                }
            }*/
        }
    });
    /**====================== Section: Contract Lists ======================*/


    /**====================== Section: Create Clause ======================*/
    elements.btnContractCreateClose.onclick = function () {
        redirectToClauseList();
    };

    elements.btnContractCreateCancel.onclick = function () {
        redirectToClauseList();
    };

    elements.inputInviteUsersTeams.onclick = function () {
        if (!elements.divInviteUsersBox.classList.contains(displayNoneClass)) {
            switchClass(elements.divInviteUsersBox, displayNoneClass, true);
        } else {
            switchClass(elements.divInviteUsersBox, displayNoneClass, false);
        }
    };

    elements.chkboxInviteAllTeams.onclick = function (event) {
        $('.team-chkbox').prop('checked', this.checked);
        updateInviteCheckbox();
        event.stopPropagation();
    };

    elements.chkboxInviteAllUsers.onclick = function (event) {
        $('.user-chkbox').prop('checked', this.checked);
        updateInviteCheckbox();
        event.stopPropagation();
    };

    $(document).on('click', '.team-chkbox', function () {
        var allChecked = $('.team-chkbox:checked').length === $('.team-chkbox').length;
        $('#chkboxInviteAllTeams').prop('checked', allChecked);
        updateInviteCheckbox();
    });

    $(document).on('click', '.user-chkbox', function () {
        var allChecked = $('.user-chkbox:checked').length === $('.user-chkbox').length;
        $('#chkboxInviteAllUsers').prop('checked', allChecked);
        updateInviteCheckbox();
    });

    $("#formClause").validate({
        ignore: "",
        rules: {
            clauseText: {
                required: true
            }
        },
        messages: {
            clauseText: {
                required: "Please select the text from the document"
            }
        },
        errorClass: "error", // CSS class for error messages
        errorPlacement: function (error, element) {
            error.insertAfter(element); // Place error messages after the element
        },
        submitHandler: function (form) {
            createClauseSection(socket);
        }
    });
    /**====================== Section: Create Clause ======================*/

    /**====================== Section: Conversation History ======================*/
    elements.btnCloseConversionHistory.onclick = async function (event) {
        if (sectionID) {
            selectedThreadID = '';
            $('.div-selected').removeClass('div-selected');
            clauseNextPage = 1;
            clauseHasNextPage = true;
            clauseLists = [];
            await getClauses();
            switchClass(elements.sectionContractLists, displayNoneClass, false);
            switchClass(elements.sectionConversionHistory, displayNoneClass, true);
            closeBottomPopup();
        } else {
            location.reload(true);
        }
    };

    elements.btnGoToCounterpartyChat.onclick = async function (event) {
        withType = 'Counterparty';
        messageConfirmationFor = 'Opposite Side';
        elements.conversionCounterparty.innerHTML = '';
        chatNextPage = 1;
        chatHasNextPage = true;
        getContractSectionDetails();
        await getContractSectionMessageList('Counterparty');
        var chatRoomName = getChatRoom(withType);
        socket.emit('joinContractSectionChatRoom', chatRoomName);
        elements.messageInputCounterParty.value = "";
        switchClass(elements.sectionCounterpartyChat, displayNoneClass, false);
        switchClass(elements.sectionSameSideChat, displayNoneClass, true);
        switchClass(elements.sectionConversionHistory, displayNoneClass, true);
    };

    elements.btnGoToSameSideChat.onclick = async function (event) {
        withType = 'Our Team';
        messageConfirmationFor = 'Same Side';
        elements.conversionSameSide.innerHTML = '';
        chatNextPage = 1;
        chatHasNextPage = true;
        getContractSectionDetails();
        await getContractSectionMessageList('our');
        var chatRoomName = getChatRoom(withType);
        socket.emit('joinContractSectionChatRoom', chatRoomName);
        elements.messageInputSameSide.value = "";
        switchClass(elements.sectionCounterpartyChat, displayNoneClass, true);
        switchClass(elements.sectionConversionHistory, displayNoneClass, true);
        switchClass(elements.sectionSameSideChat, displayNoneClass, false);
    }

    elements.divChatHistoryBody.onscroll = (e) => {
        if (elements.divChatHistoryBody?.scrollTop == 0 && chatHistoryNextPage && chatHistoryNextPage != 1) {
            getClauseConversionHistory();
        }
    };

    $(document).on('click', '.scheduled-meeting', function () {
        getContractMeetingDetails($(this).data('id'));
        elements.btnMeetingView.setAttribute('data-id', $(this).data('id'));
        elements.btnMeetingEnterOutcomes.setAttribute('data-id', $(this).data('id'));
    });

    $(document).on('click', '.btn-meeting-view', function () {
        var meetingData = {
            meetingId: $(this).data('id'),
            chatRoomName: loggedInUserDetails._id + "_" + contractID
        };
        socket.emit('scheduledMeetingView', meetingData)
    });

    $(document).on('click', '.btn-meeting-close', function () {
        closeBottomPopup();
    });
    /**====================== Section: Conversation History ======================*/

    /**====================== Section: Sameside chat ======================*/
    elements.messageInputSameSide.onkeydown = async function (event) {
        var data = {
            chatRoomName: getChatRoom(withType),
            userName: loggedInUserDetails.firstName,
            with: withType
        }
        socket.emit('userTypingContractSection', data);
    };

    elements.btnOpenInviteUserTeam.onclick = async function (event) {
        if (elements.btnOpenInviteUserTeam.closest("li").classList.contains('active')) {
            elements.btnOpenInviteUserTeam.closest("li").classList.remove('active');
        } else {
            getContractSectionDetails();
            elements.btnOpenInviteUserTeam.closest("li").classList.add('active');
        }
    };

    elements.btnGoToConversionHistory.onclick = async function (event) {
        chatHistoryNextPage = 1;
        chatHistoryHasNextPage = true;
        getClauseConversionHistory();
        switchClass(elements.sectionSameSideChat, displayNoneClass, true);
        switchClass(elements.sectionCounterpartyChat, displayNoneClass, true);
        switchClass(elements.sectionConversionHistory, displayNoneClass, false);
        closeBottomPopup();
    };

    elements.btnSendSameSide.onclick = async function (event) {
        chat_message = elements.messageInputSameSide.innerHTML;
        notifyUsers = tagUserInMessage;
        elements.messageInputSameSide.innerHTML = "";
        tagUserInMessage = [];
        if (chat_message) {
            var addNewContractMessageDetail = {
                "contractId": contractID,
                "contractSectionId": selectedClauseID,
                "message": chat_message,
                "notifyUsers": notifyUsers,
                "with": withType,
                "messageType": 'Normal',
                "companyId": loggedInCompanyDetails._id,
                "oppositeCompanyId": counterPartyCompanyDetail && counterPartyCompanyDetail._id ? counterPartyCompanyDetail._id : null,
                "threadID": selectedThreadID,
                "status": 'send',
                "actionperformedbyUser": loggedInUserDetails.firstName + " " + loggedInUserDetails.lastName,
                "actionperformedbyUserImage": loggedInUserDetails.imageKey,
                "actionperformedbyUserRole": openContractResponseData.userRole,
                "messageConfirmationFor": messageConfirmationFor,
                "chatRoomName": getChatRoom(withType),
                "messageNumber": 0,
                "chatWindow": withType
            };
            await addContractSectionMessage(addNewContractMessageDetail, socket);
        }
    };

    elements.btnSendPositionConfirmationSameSide.onclick = async function (event) {
        var getClauseDetails = clauseLists.find((ele) => ele._id == selectedClauseID);
        if (contractInformation && contractInformation.userWhoHasEditAccess == loggedInUserDetails._id && contractInformation.canSendPositionConfirmation && selectedContractSectionDetails && selectedContractSectionDetails.contractSectionData && selectedContractSectionDetails.contractSectionData.isSectionInDraftMode) {
            switchClass(elements.sendDraftConfirmationPopup, displayNoneClass, false);
        } else if (openContractResponseData.canSendPositionConfirmation) {
            switchClass(elements.sendPositionConfirmationPopup, displayNoneClass, false);
        }
    };

    elements.btnWithdrawnClauseSameSide.onclick = async function (event) {
        var varWithdrawnContractSection = {
            "contractId": contractID,
            "contractSectionId": selectedClauseID,
            "with": withType,
            "messageType": 'Notification',
            "companyId": loggedInCompanyDetails._id,
            "oppositeCompanyId": counterPartyCompanyDetail && counterPartyCompanyDetail._id ? counterPartyCompanyDetail._id : null,
            "threadID": selectedThreadID,
            "status": '',
            "confirmationType": 'withdrawn',
            "actionperformedbyUser": loggedInUserDetails.firstName + " " + loggedInUserDetails.lastName,
            "actionperformedbyUserImage": loggedInUserDetails.imageKey,
            "actionperformedbyUserRole": openContractResponseData.userRole,
            "messageConfirmationFor": messageConfirmationFor,
            "chatRoomName": getChatRoom(withType),
            "messageId": $(this).data('id'),
            "messageNumber": 0,
            "chatWindow": withType
        };
        withdrawnContractSection(varWithdrawnContractSection, socket);
    };

    elements.btnCloseSameSideChat.onclick = async function (event) {
        if (sectionID) {
            selectedThreadID = '';
            $('.div-selected').removeClass('div-selected');
            clauseNextPage = 1;
            clauseHasNextPage = true;
            clauseLists = [];
            await getClauses();
            switchClass(elements.sectionContractLists, displayNoneClass, false);
            switchClass(elements.sectionSameSideChat, displayNoneClass, true);
            closeBottomPopup();
        } else {
            location.reload(true);
        }
    };

    elements.btnInviteUsers.onclick = async function (event) {
        var getClauseDetails = clauseLists.find((ele) => ele._id == selectedClauseID);
        if (getClauseDetails) {
            var isAllInvited = [];
            if (openContractResponseData.userRole == 'Admin' || openContractResponseData.userRole == 'Counterparty' || openContractResponseData.userRole == 'Contract Creator') {
                inviteUserListIDs.forEach((el) => {
                    if (!(selectedContractSectionDetails.contractAssignedUsers.findIndex((ele) => ele.userId._id == el.itemId) > -1)) {
                        isAllInvited.push(false);
                    } else {
                        isAllInvited.push(true);
                    }
                });
            } else {
                inviteUserListIDs.forEach((el) => {
                    // if (!getClauseDetails.assignedUser.includes(el.itemId)) {
                    if (!(selectedContractSectionDetails.contractAssignedUsers.findIndex((ele) => ele.userId._id == el.itemId) > -1)) {
                        isAllInvited.push(false);
                    } else {
                        isAllInvited.push(true);
                    }
                });
            }
            if (inviteUserListIDs && inviteUserListIDs.length == 0) {
                switchClass(elements.allUserInvitedMessage, displayNoneClass, true);
                switchClass(elements.noUserInviteListMessage, displayNoneClass, false);
                switchClass(elements.partiallyInvitedUserListMessage, displayNoneClass, true);
                switchClass(elements.sendInviteUsers, displayNoneClass, true);
                switchClass(elements.inviteUserTable, displayNoneClass, true);
            } else if (!isAllInvited.includes(false)) {
                switchClass(elements.allUserInvitedMessage, displayNoneClass, false);
                switchClass(elements.noUserInviteListMessage, displayNoneClass, true);
                switchClass(elements.partiallyInvitedUserListMessage, displayNoneClass, true);
                switchClass(elements.sendInviteUsers, displayNoneClass, true);
                switchClass(elements.inviteUserTable, displayNoneClass, true);
            } else {
                switchClass(elements.allUserInvitedMessage, displayNoneClass, true);
                switchClass(elements.noUserInviteListMessage, displayNoneClass, true);
                switchClass(elements.partiallyInvitedUserListMessage, displayNoneClass, false);
                switchClass(elements.sendInviteUsers, displayNoneClass, false);
                switchClass(elements.inviteUserTable, displayNoneClass, false);
                inviteUserSelect = [];
                inviteTeamSelect = [];
                // Render the User Table
                var iHtml = '<h4>Select User</h4>\n';
                iHtml += '<div class="table-responsive">\n' +
                    '\t\t\t\t<table class="table table-hover">\n' +
                    '\t\t\t\t\t\t\t\t<thead class="thead-dark">\n' +
                    '\t\t\t\t\t\t\t\t<tr>\n' +
                    '\t\t\t\t\t\t\t\t\t\t\t\t<th scope="col">\n' +
                    '\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div class="form-check"><input type="checkbox" id="inviteAllUsersFromPopup" class="form-check-input"></div>\n' +
                    '\t\t\t\t\t\t\t\t\t\t\t\t</th>\n' +
                    '\t\t\t\t\t\t\t\t\t\t\t\t<th scope="col">Name</th>\n' +
                    '\t\t\t\t\t\t\t\t\t\t\t\t<th scope="col">Email</th>\n' +
                    '\t\t\t\t\t\t\t\t</tr>\n' +
                    '\t\t\t\t\t\t\t\t</thead>\n' +
                    '\t\t\t\t\t\t\t\t<tbody>\n';
                inviteUserListIDs.forEach((el) => {
                    // var checkFindIndex = inviteUserListIDs.findIndex((e) => e.itemId == el);
                    // if (!getClauseDetails.assignedUser.includes(el.itemId)) {
                    if (!(selectedContractSectionDetails.contractAssignedUsers.findIndex((ele) => ele.userId._id == el.itemId) > -1)) {
                        iHtml += '\t\t\t\t\t\t\t\t<tr>\n' +
                            '\t\t\t\t\t\t\t\t\t\t\t\t<td>\n' +
                            '\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div class="form-check" data-id="' + el.itemId + '"><input type="checkbox" class="form-check-input invite-user-chkbox" value=""></div>\n' +
                            '\t\t\t\t\t\t\t\t\t\t\t\t</td>\n' +
                            '\t\t\t\t\t\t\t\t\t\t\t\t<td>' + el.itemName + '</td>\n' +
                            '\t\t\t\t\t\t\t\t\t\t\t\t<td>' + el.emailAddress + '</td>\n' +
                            '\t\t\t\t\t\t\t\t</tr>\n';
                    }
                });
                iHtml += '\t\t\t\t\t\t\t\t</tbody>\n' +
                    '\t\t\t\t</table>\n' +
                    '</div>';
                elements.inviteUserTable.innerHTML = '';
                elements.inviteUserTable.innerHTML = iHtml;
            }
            switchClass(elements.inviteUserPopup, displayNoneClass, false);
            switchClass(elements.inviteTeamPopup, displayNoneClass, true);
        }
    };

    elements.btnInviteTeams.onclick = async function (event) {
        var getClauseDetails = clauseLists.find((ele) => ele._id == selectedClauseID);
        if (getClauseDetails) {
            var isAllInvited = [];
            if (inviteTeamListIDs.length !== selectedContractSectionDetails.contractAssignedTeams.length) {
                isAllInvited.push(false);
            } else {
                inviteTeamListIDs.forEach((el) => {
                    if (!getClauseDetails.assignedTeam.includes(el.itemId)) {
                        isAllInvited.push(false);
                    } else {
                        isAllInvited.push(true);
                    }
                });
            }

            if (inviteTeamListIDs && inviteTeamListIDs.length == 0) {
                switchClass(elements.allTeamInvitedMessage, displayNoneClass, true);
                switchClass(elements.noTeamInviteListMessage, displayNoneClass, false);
                switchClass(elements.partiallyInvitedTeamListMessage, displayNoneClass, true);
                switchClass(elements.sendInviteTeams, displayNoneClass, true);
                switchClass(elements.inviteTeamTable, displayNoneClass, true);
            } else if (!isAllInvited.includes(false)) {
                switchClass(elements.allTeamInvitedMessage, displayNoneClass, false);
                switchClass(elements.noTeamInviteListMessage, displayNoneClass, true);
                switchClass(elements.partiallyInvitedTeamListMessage, displayNoneClass, true);
                switchClass(elements.sendInviteTeams, displayNoneClass, true);
                switchClass(elements.inviteTeamTable, displayNoneClass, true);
            } else {
                switchClass(elements.allTeamInvitedMessage, displayNoneClass, true);
                switchClass(elements.noTeamInviteListMessage, displayNoneClass, true);
                switchClass(elements.partiallyInvitedTeamListMessage, displayNoneClass, false);
                switchClass(elements.sendInviteTeams, displayNoneClass, false);
                switchClass(elements.inviteTeamTable, displayNoneClass, false);
                inviteUserSelect = [];
                inviteTeamSelect = [];
                // Render the Team Table
                var iHtml = '<h4>Select Team</h4>\n';
                iHtml += '<div class="table-responsive">\n' +
                    '\t\t\t\t<table class="table table-hover">\n' +
                    '\t\t\t\t\t\t\t\t<thead class="thead-dark">\n' +
                    '\t\t\t\t\t\t\t\t<tr>\n' +
                    '\t\t\t\t\t\t\t\t\t\t\t\t<th scope="col">\n' +
                    '\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div class="form-check"><input type="checkbox" id="inviteAllTeamsFromPopup" class="form-check-input"></div>\n' +
                    '\t\t\t\t\t\t\t\t\t\t\t\t</th>\n' +
                    '\t\t\t\t\t\t\t\t\t\t\t\t<th scope="col">Name</th>\n' +
                    '\t\t\t\t\t\t\t\t</tr>\n' +
                    '\t\t\t\t\t\t\t\t</thead>\n' +
                    '\t\t\t\t\t\t\t\t<tbody>\n';
                inviteTeamListIDs.forEach((el) => {
                    // var checkFindIndex = inviteUserListIDs.findIndex((e) => e.itemId == el);
                    if (!getClauseDetails.assignedTeam.includes(el.itemId)) {
                        iHtml += '\t\t\t\t\t\t\t\t<tr>\n' +
                            '\t\t\t\t\t\t\t\t\t\t\t\t<td>\n' +
                            '\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div class="form-check" data-id="' + el.itemId + '"><input type="checkbox" class="form-check-input invite-team-chkbox" value=""></div>\n' +
                            '\t\t\t\t\t\t\t\t\t\t\t\t</td>\n' +
                            '\t\t\t\t\t\t\t\t\t\t\t\t<td>' + el.itemName + '</td>\n' +
                            '\t\t\t\t\t\t\t\t</tr>\n';
                    }
                });
                iHtml += '\t\t\t\t\t\t\t\t</tbody>\n' +
                    '\t\t\t\t</table>\n' +
                    '</div>';

                elements.inviteTeamTable.innerHTML = '';
                elements.inviteTeamTable.innerHTML = iHtml;
            }

            switchClass(elements.inviteUserPopup, displayNoneClass, true);
            switchClass(elements.inviteTeamPopup, displayNoneClass, false);
        }
    };

    elements.sendInviteUsers.onclick = async function (event) {
        inviteUsersInContractSection(socket, 'users');
    };

    elements.sendInviteTeams.onclick = async function (event) {
        inviteUsersInContractSection(socket, 'teams');
    };

    elements.btnGoToCounterparty.onclick = async function (event) {
        withType = 'Counterparty';
        messageConfirmationFor = 'Opposite Side';
        elements.conversionCounterparty.innerHTML = '';
        chatNextPage = 1;
        chatHasNextPage = true;
        getContractSectionDetails();
        await getContractSectionMessageList('Counterparty');
        var chatRoomName = getChatRoom(withType);
        socket.emit('joinContractSectionChatRoom', chatRoomName);
        elements.messageInputCounterParty.value = "";
        switchClass(elements.sectionCounterpartyChat, displayNoneClass, false);
        switchClass(elements.sectionSameSideChat, displayNoneClass, true);
        switchClass(elements.sectionConversionHistory, displayNoneClass, true);
    };

    elements.divChatSameSideBody.onscroll = (e) => {
        if (elements.divChatSameSideBody?.scrollTop == 0 && chatHasNextPage && chatNextPage != 1) {
            getContractSectionMessageList('our');
        }
    };

    elements.inputAssignDraftRequest.onclick = async function (event) {
        if (elements.assignDraftRequestBox.classList.contains(displayNoneClass)) {
            elements.accordionAssignDraftRequest.innerHTML = '';
            getContractTeamAndUserList('assignDraftRequest');
            switchClass(elements.assignDraftRequestBox, displayNoneClass, false);
        } else {
            switchClass(elements.assignDraftRequestBox, displayNoneClass, true);
        }

    };

    elements.btnScheduleMeetingSameSide.onclick = async function (event) {
        var meetingData = {
            contractId: contractID,
            contractSectionId: selectedClauseID,
            contractSectionThreadId: selectedThreadID,
            chatRoomName: loggedInUserDetails._id + "_" + contractID
        };
        socket.emit('meetingSchedule', meetingData)
    };

    document.addEventListener('click', function (e) {
        if (!elements.divInviteUserTabs.contains(e.target) && e.target !== elements.imgInviteUserTeam) {
            if (elements.btnOpenInviteUserTeam.closest('li')) {
                switchClass(elements.btnOpenInviteUserTeam.closest('li'), 'active', false);
            }
        }
    });

    $(document).on('click', '#inviteAllUsersFromPopup', function () {
        $('.invite-user-chkbox').prop('checked', this.checked);
        updateInvitePopupCheckbox();
    });

    $(document).on('click', '.invite-user-chkbox', function () {
        var allChecked = $('.invite-user-chkbox:checked').length === $('.invite-user-chkbox').length;
        $('#inviteAllUsersFromPopup').prop('checked', allChecked);
        updateInvitePopupCheckbox();
    });

    $(document).on('click', '#inviteAllTeamsFromPopup', function () {
        $('.invite-team-chkbox').prop('checked', this.checked);
        updateInvitePopupCheckbox();
    });

    $(document).on('click', '.invite-team-chkbox', function () {
        var allChecked = $('.invite-team-chkbox:checked').length === $('.invite-team-chkbox').length;
        $('#inviteAllTeamsFromPopup').prop('checked', allChecked);
        updateInvitePopupCheckbox();
    });

    $(document).on('click', '.btn-close-bottom-popup', function () {
        closeBottomPopup();
    });

    $(document).on('click', '.assign-user', function () {
        elements.assignDraftRequestMessageId.value = $(this).data('id');
        switchClass(elements.assignDraftRequestPopup, displayNoneClass, false);
    });

    $(document).on('click', '.draft-request-user', function () {
        var userID = $(this).data('id');
        var userName = $(this).data('name');
        updateAssignDraftRequest(userID, userName);
        document.getElementById('sendAssignDraftRequest').disabled = false;
        $('#btncollapseUsersA').toggleClass('active');
        var target = $('#btncollapseUsersA').attr('data-bs-target');
        $(target).collapse('toggle');
        document.getElementById('assignDraftRequestBox').classList.add(displayNoneClass);
    });

    setInterval(function() {
        var hasDNoneClass = $('#assignDraftingRequestBox').hasClass('d-none');
        if (!hasDNoneClass) {
            $('#assignDraftingRequestInput-error').addClass('d-none');
        } else {
            $('#assignDraftingRequestInput-error').removeClass('d-none');
        }
    }, 250);

    $("#formAssignDraftRequest").validate({
        submitHandler: function (form) {
            var assignDraftRequest = {
                "contractId": contractID,
                "contractSectionId": selectedClauseID,
                "status": "approved",
                "confirmationType": "assign_draft",
                "messageType": "Notification",
                "with": withType,
                "companyId": loggedInCompanyDetails._id,
                "oppositeCompanyId": counterPartyCompanyDetail._id,
                "threadID": selectedThreadID,
                "messageConfirmationFor": messageConfirmationFor,
                "messageId": elements.assignDraftRequestMessageId.value,
                "actionperformedbyUser": loggedInUserDetails.firstName + " " + loggedInUserDetails.lastName,
                "actionperformedbyUserImage": loggedInUserDetails.imageKey,
                "chatRoomName": getChatRoom(withType),
                "sendTo": elements.assignDraftRequestUserId.value,
                "sendToName": elements.inputAssignDraftRequest.placeholder,
                "chatWindow": withType
            };
            /*console.log('assignDraftRequest', assignDraftRequest);
            return false;*/
            updateContractSectionConfirmationStatus(assignDraftRequest, socket);
            $('.assign-user[data-id="' + assignDraftRequest.messageId + '"]').parent().addClass(displayNoneClass);
            elements.inputAssignDraftRequest.placeholder = "Select user";
        }
    });

    /**
     * @description This function is set the AtWho user lists
     */
    function setSameSideUserTagLists() {
        $('#messageInputSameSide').atwho({
            at: "@",
            data: sameSideUserList,
            displayTpl: "<li class='sameside-list'>${name}</li>",
            insertTpl: '<a href="#" data-type="mentionable" data-id="${id}" data-companyid="${companyId}" data-name="${name}">@${name}</a>',
            callbacks: {
                beforeInsert: function (value, $li) {
                    var match = value.match(/data-id="([0-9a-f]+)"/);
                    var match2 = value.match(/data-companyid="([0-9a-f]+)"/);
                    if (match && match2) {
                        var dataIdValue = match[1];
                        var dataCompanyIdValue = match2[1];
                        tagUserInMessage.push({"userId": dataIdValue, "companyId": dataCompanyIdValue});
                    }
                    return value;
                }
            }
        });
    }

    /**
     * @description This function will prepare the object for invite users and teams
     */
    function updateInvitePopupCheckbox() {
        $('.invite-user-chkbox').each(function () {
            var isChecked = $(this).prop("checked");
            var dataID = $(this).parent().data('id');
            var jsonData = inviteUserListIDs.find((ele) => ele.itemId == dataID);
            if (isChecked) {
                if (inviteUserSelect.findIndex((ele) => ele.itemId == jsonData.itemId) < 0) {
                    inviteUserSelect.push(jsonData);
                }
            } else {
                if (inviteUserSelect.findIndex((ele) => ele.itemId == jsonData.itemId) > -1) {
                    inviteUserSelect = $.grep(inviteUserSelect, function (value) {
                        return value.itemId != dataID;
                    });
                }
            }
        });

        $('.invite-team-chkbox').each(function () {
            var isChecked = $(this).prop("checked");
            var dataID = $(this).parent().data('id');
            var jsonData = inviteTeamListIDs.find((ele) => ele.itemId == dataID);
            if (isChecked) {
                if (inviteTeamSelect.findIndex((ele) => ele.itemId == jsonData.itemId) < 0) {
                    inviteTeamSelect.push(jsonData);
                }
            } else {
                if (inviteTeamSelect.findIndex((ele) => ele.itemId == jsonData.itemId) > -1) {
                    inviteTeamSelect = $.grep(inviteTeamSelect, function (value) {
                        return value.itemId != dataID;
                    });
                }
            }
        });
        updateUserInvitePopupButton();
    }

    /**
     * @description Update the invite button enable/disable
     */
    function updateUserInvitePopupButton() {
        var buttonUser = elements.sendInviteUsers;
        if (inviteUserSelect && inviteUserSelect.length > 0) {
            buttonUser.disabled = false;
        } else {
            buttonUser.disabled = true;
        }

        var buttonTeam = elements.sendInviteTeams;
        if (inviteTeamSelect && inviteTeamSelect.length > 0) {
            buttonTeam.disabled = false;
        } else {
            buttonTeam.disabled = true;
        }
    };

    /**
     * @description This function is used for set the name and store the id on hidden input
     * @param userID
     * @param userName
     */
    function updateAssignDraftRequest(userID, userName) {
        elements.assignDraftRequestUserId.value = userID;
        elements.inputAssignDraftRequest.value = userName;
        elements.inputAssignDraftRequest.placeholder = userName;
    }
    /**====================== Section: Sameside chat ======================*/


    /**====================== Section: Counterparty chat ======================*/
    elements.messageInputCounterParty.onkeydown = async function (event) {
        var data = {
            chatRoomName: getChatRoom(withType),
            userName: loggedInUserDetails.firstName,
            with: withType
        };
        socket.emit('userTypingContractSection', data);
    };

    elements.btnGoToConversionChatHistory.onclick = async function (event) {
        chatHistoryNextPage = 1;
        chatHistoryHasNextPage = true;
        getClauseConversionHistory();
        switchClass(elements.sectionSameSideChat, displayNoneClass, true);
        switchClass(elements.sectionCounterpartyChat, displayNoneClass, true);
        switchClass(elements.sectionConversionHistory, displayNoneClass, false);
        closeBottomPopup();
    };

    elements.btnSendCounterParty.onclick = async function (event) {
        chat_message = elements.messageInputCounterParty.innerHTML;
        notifyUsers = tagUserInMessage;
        elements.messageInputCounterParty.innerHTML = "";
        tagUserInMessage = [];
        if (chat_message) {
            var addNewContractMessageDetail = {
                "contractId": contractID,
                "contractSectionId": selectedClauseID,
                "message": chat_message,
                "notifyUsers": notifyUsers,
                "with": withType,
                "messageType": 'Normal',
                "companyId": loggedInCompanyDetails._id,
                "oppositeCompanyId": counterPartyCompanyDetail && counterPartyCompanyDetail._id ? counterPartyCompanyDetail._id : null,
                "threadID": selectedThreadID,
                "status": 'send',
                "actionperformedbyUser": loggedInUserDetails.firstName + " " + loggedInUserDetails.lastName,
                "actionperformedbyUserImage": loggedInUserDetails.imageKey,
                "actionperformedbyUserRole": openContractResponseData.userRole,
                "messageConfirmationFor": messageConfirmationFor,
                "chatRoomName": getChatRoom(withType),
                "messageNumber": 0,
                "chatWindow": withType
            };
            await addContractSectionMessage(addNewContractMessageDetail, socket);
        }
    };

    elements.btnGoToSameSide.onclick = async function (event) {
        withType = 'Our Team';
        messageConfirmationFor = 'Same Side';
        elements.conversionSameSide.innerHTML = '';
        chatNextPage = 1;
        chatHasNextPage = true;
        getContractSectionDetails();
        await getContractSectionMessageList('our');
        var chatRoomName = getChatRoom(withType);
        socket.emit('joinContractSectionChatRoom', chatRoomName);
        elements.messageInputSameSide.value = "";
        switchClass(elements.sectionCounterpartyChat, displayNoneClass, true);
        switchClass(elements.sectionConversionHistory, displayNoneClass, true);
        switchClass(elements.sectionSameSideChat, displayNoneClass, false);
    };

    elements.btnCloseCounterpartyChat.onclick = async function (event) {
        if (sectionID) {
            selectedThreadID = '';
            $('.div-selected').removeClass('div-selected');
            clauseNextPage = 1;
            clauseHasNextPage = true;
            clauseLists = [];
            await getClauses();
            switchClass(elements.sectionContractLists, displayNoneClass, false);
            switchClass(elements.sectionCounterpartyChat, displayNoneClass, true);
            closeBottomPopup();
        } else {
            location.reload(true);
        }
    };

    elements.btnSendPositionConfirmationCounterparty.onclick = async function (event) {
        getContractDetails(socket, redirection = false);
        // var getClauseDetails = clauseLists.find((ele) => ele._id == selectedClauseID);
        if (openContractResponseData && openContractResponseData.canSendPositionConfirmation && selectedContractSectionDetails && selectedContractSectionDetails.contractSectionData && selectedContractSectionDetails.contractSectionData.isSectionInDraftMode) {
            if (contractInformation.userWhoHasEditAccess == loggedInUserDetails._id || openContractResponseData.userRole == "Counterparty" || openContractResponseData.userRole == "Contract Creator" || openContractResponseData.userRole == "Admin") {
                switchClass(elements.sendDraftConfirmationPopup, displayNoneClass, false);
            } else {
                switchClass(elements.sendPositionConfirmationPopup, displayNoneClass, false);
            }
        } else if (openContractResponseData.canSendPositionConfirmation) {
            switchClass(elements.sendPositionConfirmationPopup, displayNoneClass, false);
        }
    };

    elements.divChatCounterPartyBody.onscroll = (e) => {
        if (elements.divChatCounterPartyBody?.scrollTop == 0 && chatHasNextPage && chatNextPage != 1) {
            getContractSectionMessageList('Counterparty');
        }
    };

    elements.sendToTeamForDraft.onclick = async function (event) {
        if (this.checked) {
            switchClass(elements.divDraftingBox, displayNoneClass, false);
        } else {
            switchClass(elements.divDraftingBox, displayNoneClass, true);
        }
    };

    elements.assignDraftingRequestInput.onclick = async function (event) {
        if (elements.assignDraftingRequestBox.classList.contains(displayNoneClass)) {
            elements.accordionPositionConfirmation.innerHTML = '';
            getContractTeamAndUserList('positionConfirmation');
            switchClass(elements.assignDraftingRequestBox, displayNoneClass, false);
        } else {
            switchClass(elements.assignDraftingRequestBox, displayNoneClass, true);
        }
    };

    elements.btnScheduleMeetingCounterparty.onclick = async function (event) {
        var meetingData = {
            contractId: contractID,
            contractSectionId: selectedClauseID,
            contractSectionThreadId: selectedThreadID,
            chatRoomName: loggedInUserDetails._id + "_" + contractID
        };
        socket.emit('meetingSchedule', meetingData)
    };

    $(document).on('click', '.reconfirm-approve', function () {
        elements.formReconfirmPosition.reset();
        switchClass(elements.divDraftingBox, displayNoneClass, true);
        elements.assignDraftingRequestUserId.value = "";
        elements.approvePositionMessageId.value = $(this).data('id');
        elements.assignDraftingRequestInput.placeholder = "Select user";
        switchClass(elements.confirmPositionPopup, displayNoneClass, false);
    });

    $(document).on('click', '.assign-draft-request-user', function () {
        var userID = $(this).data('id');
        var userName = $(this).data('name');
        updateAssignDraftRequestDropdown(userID, userName);
        elements.sendAssignDraftRequest.disabled = false;
        $('#btncollapseUsersB').toggleClass('active');
        var target = $('#btncollapseUsersB').attr('data-bs-target');
        $(target).collapse('toggle');
        switchClass(elements.assignDraftingRequestBox, displayNoneClass, true);
    });

    $(document).on('click', '.reconfirm-reject', function () {
        elements.rejectPositionMessageId.value = $(this).data('id');
        switchClass(elements.rejectPositionPopup, displayNoneClass, false);
    });

    $(document).on('click', '.approve-possition', function () {
        var approveConfirmation = {
            "contractId": contractID,
            "contractSectionId": selectedClauseID,
            "with": withType,
            "messageType": 'Notification',
            "companyId": loggedInCompanyDetails._id,
            "oppositeCompanyId": counterPartyCompanyDetail && counterPartyCompanyDetail._id ? counterPartyCompanyDetail._id : null,
            "threadID": selectedThreadID,
            "status": 'approved',
            "confirmationType": "position",
            "actionperformedbyUser": loggedInUserDetails.firstName + " " + loggedInUserDetails.lastName,
            "actionperformedbyUserImage": loggedInUserDetails.imageKey,
            "actionperformedbyUserRole": openContractResponseData.userRole,
            "messageConfirmationFor": messageConfirmationFor,
            "chatRoomName": getChatRoom(withType),
            "messageId": $(this).data('id'),
            "messageNumber": 0,
            "chatWindow": withType
        };
        updateContractSectionConfirmationStatus(approveConfirmation, socket);
        $(this).parent().addClass('d-none');
    });

    $(document).on('click', '.btn-box-re-open', function () {
        var reopenDetail = {
            "contractId": contractID,
            "contractSectionId": selectedClauseID,
            "confirmationType": "Reopen",
            "messageType": 'Notification',
            "with": withType,
            "companyId": loggedInCompanyDetails._id,
            "oppositeCompanyId": counterPartyCompanyDetail && counterPartyCompanyDetail._id ? counterPartyCompanyDetail._id : null,
            "threadID": selectedThreadID,
            "actionperformedbyUser": loggedInUserDetails.firstName + " " + loggedInUserDetails.lastName,
            "actionperformedbyUserImage": loggedInUserDetails.imageKey,
            "actionperformedbyUserRole": openContractResponseData.userRole,
            "messageConfirmationFor": messageConfirmationFor,
            "chatRoomName": getChatRoom(withType),
            "chatWindow": withType
        };
        reOpenContractSection(reopenDetail, socket);
        switchClass(elements.divChatSameSideBody, 'contract-completed', false);
        switchClass(elements.divChatCounterPartyBody, 'contract-completed', false);
        switchClass(elements.divSameSideTextbox, displayNoneClass, false);
        switchClass(elements.divCounterpartyTextbox, displayNoneClass, false);

        var actionSameSide = document.querySelectorAll('.action-sameside');
        actionSameSide.forEach(function (element) {
            element.classList.remove(displayNoneClass);
        });
        var actionCounterparty = document.querySelectorAll('.action-counterparty');
        actionCounterparty.forEach(function (element) {
            element.classList.remove(displayNoneClass);
        });
        var draftConfirmCPElement = document.getElementById("draftConfirmCP");
        if (draftConfirmCPElement) {
            draftConfirmCPElement.parentNode.removeChild(draftConfirmCPElement);
        }
        var draftConfirmSSElement = document.getElementById("draftConfirmSS");
        if (draftConfirmSSElement) {
            draftConfirmSSElement.parentNode.removeChild(draftConfirmSSElement);
        }
    });

    $(document).on('click', '.draft-approve', function () {
        var approveDraftConfirmation = {
            "contractId": contractID,
            "contractSectionId": selectedClauseID,
            "with": withType,
            "messageType": 'Notification',
            "companyId": loggedInCompanyDetails._id,
            "oppositeCompanyId": counterPartyCompanyDetail && counterPartyCompanyDetail._id ? counterPartyCompanyDetail._id : null,
            "threadID": selectedThreadID,
            "status": 'approved',
            "confirmationType": "draft",
            "actionperformedbyUser": loggedInUserDetails.firstName + " " + loggedInUserDetails.lastName,
            "actionperformedbyUserImage": loggedInUserDetails.imageKey,
            "actionperformedbyUserRole": openContractResponseData.userRole,
            "messageConfirmationFor": messageConfirmationFor,
            "chatRoomName": getChatRoom(withType),
            "messageId": $(this).data('id'),
            "chatWindow": withType
        };
        updateContractSectionConfirmationStatus(approveDraftConfirmation, socket);
        $(this).parent().addClass('d-none');
    });

    $(document).on('click', '.draft-reject', function () {
        elements.rejectDraftMessageId.value = $(this).data('id');
        switchClass(elements.rejectDarftPopup, displayNoneClass, false);
    });

    $("#formReconfirmPosition").validate({
        rules: {
            inputPositionReason: {
                required: true
            },
            assignDraftingRequestInput: {
                required: function(element) {
                    return elements.sendToTeamForDraft.checked
                }
            }
        },
        submitHandler: function (form) {
            var approveConfirmation = {
                "contractId": contractID,
                "contractSectionId": selectedClauseID,
                "message": $('#inputPositionReason').val(),
                "with": "Counterparty",
                "messageType": 'Notification',
                "companyId": loggedInCompanyDetails._id,
                "oppositeCompanyId": counterPartyCompanyDetail && counterPartyCompanyDetail._id ? counterPartyCompanyDetail._id : null,
                "threadID": selectedThreadID,
                "status": 'approved',
                "confirmationType": "request_draft",
                "actionperformedbyUser": loggedInUserDetails.firstName + " " + loggedInUserDetails.lastName,
                "actionperformedbyUserImage": loggedInUserDetails.imageKey,
                "actionperformedbyUserRole": openContractResponseData.userRole,
                "actionperformedbyUserType": loggedInCompanyDetails._id == contractInformation.counterPartyCompanyId ? 'Counterparty' : 'Customer',
                "messageConfirmationFor": 'Opposite Side',
                "chatRoomName": getChatRoom('Counterparty'),
                "messageId": $('#approvePositionMessageId').val(),
                "messageNumber": 0,
                "chatWindow": withType
            };
            if (elements.assignDraftingRequestUserId.value && elements.sendToTeamForDraft.checked) {
                approveConfirmation.with = 'Our Team';
                approveConfirmation.messageConfirmationFor = 'Same Side';
                approveConfirmation.sendTo = elements.assignDraftingRequestUserId.value;
                approveConfirmation.sendToName = elements.assignDraftingRequestInput.placeholder;
                approveConfirmation.chatRoomName = 'user_' + counterPartyCompanyDetail._id + selectedThreadID
            }
            updateContractSectionConfirmationStatus(approveConfirmation, socket);
            $('.reconfirm-approve[data-id="' + approveConfirmation.messageId + '"]').parent().addClass(displayNoneClass);
        }
    });

    $("#formSendPositionConfirmation").validate({
        submitHandler: function (form, event) {
            chat_message = elements.inputSendPositionConfirmation.value;
            elements.inputSendPositionConfirmation.value = "";
            if (chat_message) {
                var sendPositionConfirmation = {
                    "contractId": contractID,
                    "contractSectionId": selectedClauseID,
                    "message": chat_message,
                    "with": withType,
                    "messageType": 'Position Confirmation',
                    "companyId": loggedInCompanyDetails._id,
                    "oppositeCompanyId": counterPartyCompanyDetail && counterPartyCompanyDetail._id ? counterPartyCompanyDetail._id : null,
                    "threadID": selectedThreadID,
                    "status": 'send',
                    "messageStatus": 'None',
                    "actionperformedbyUser": loggedInUserDetails.firstName + " " + loggedInUserDetails.lastName,
                    "actionperformedbyUserImage": loggedInUserDetails.imageKey,
                    "actionperformedbyUserRole": openContractResponseData.userRole,
                    "actionperformedbyUserId": loggedInUserDetails._id,
                    "messageConfirmationFor": messageConfirmationFor,
                    "chatRoomName": getChatRoom(withType),
                    "messageNumber": 0,
                    "chatWindow": withType
                };
                addContractSectionMessage(sendPositionConfirmation, socket);
            }
        }
    });

    $("#formRejectPosition").validate({
        submitHandler: function (form) {
            var rejectConfirmation = {
                "contractId": contractID,
                "contractSectionId": selectedClauseID,
                "message": elements.inputRejectPositionReason.value,
                "with": withType,
                "messageType": 'Notification',
                "companyId": loggedInCompanyDetails._id,
                "oppositeCompanyId": counterPartyCompanyDetail && counterPartyCompanyDetail._id ? counterPartyCompanyDetail._id : null,
                "threadID": selectedThreadID,
                "status": 'rejected',
                "confirmationType": "position",
                "actionperformedbyUser": loggedInUserDetails.firstName + " " + loggedInUserDetails.lastName,
                "actionperformedbyUserImage": loggedInUserDetails.imageKey,
                "actionperformedbyUserRole": openContractResponseData.userRole,
                "messageConfirmationFor": messageConfirmationFor,
                "chatRoomName": getChatRoom(withType),
                "messageId": elements.rejectPositionMessageId.value,
                "messageNumber": 0,
                "chatWindow": withType
            };
            updateContractSectionConfirmationStatus(rejectConfirmation, socket);
            $('.reconfirm-reject[data-id="' + rejectConfirmation.messageId + '"]').parent().addClass(displayNoneClass);
        }
    });

    $("#formSendDraftConfirmation").validate({
        submitHandler: function (form) {
            chat_message = elements.inputSendDraftConfirmation.value;
            elements.inputSendDraftConfirmation.value = "";
            if (chat_message) {
                var sendDraftConfirmation = {
                    "contractId": contractID,
                    "contractSectionId": selectedClauseID,
                    "message": chat_message,
                    "with": withType,
                    "messageType": 'Draft Confirmation',
                    "companyId": loggedInCompanyDetails._id,
                    "oppositeCompanyId": counterPartyCompanyDetail && counterPartyCompanyDetail._id ? counterPartyCompanyDetail._id : null,
                    "threadID": selectedThreadID,
                    "status": 'send',
                    "messageStatus": 'None',
                    "actionperformedbyUser": loggedInUserDetails.firstName + " " + loggedInUserDetails.lastName,
                    "actionperformedbyUserImage": loggedInUserDetails.imageKey,
                    "actionperformedbyUserRole": openContractResponseData.userRole,
                    "actionperformedbyUserId": loggedInUserDetails._id,
                    "messageConfirmationFor": messageConfirmationFor,
                    "chatRoomName": getChatRoom(withType),
                    "messageNumber": 0,
                    "chatWindow": withType
                };
                addContractSectionMessage(sendDraftConfirmation, socket);
            }
        }
    });

    $("#formRejectDraft").validate({
        submitHandler: function (form) {
            var rejectConfirmation = {
                "contractId": contractID,
                "contractSectionId": selectedClauseID,
                "message": elements.inputRejectDraftReason.value,
                "with": withType,
                "messageType": 'Notification',
                "companyId": loggedInCompanyDetails._id,
                "oppositeCompanyId": counterPartyCompanyDetail && counterPartyCompanyDetail._id ? counterPartyCompanyDetail._id : null,
                "threadID": selectedThreadID,
                "status": 'rejected',
                "confirmationType": "draft",
                "actionperformedbyUser": loggedInUserDetails.firstName + " " + loggedInUserDetails.lastName,
                "actionperformedbyUserImage": loggedInUserDetails.imageKey,
                "actionperformedbyUserRole": openContractResponseData.userRole,
                "messageConfirmationFor": messageConfirmationFor,
                "chatRoomName": getChatRoom(withType),
                "messageId": elements.rejectDraftMessageId.value,
                "messageNumber": 0,
                "chatWindow": withType
            };
            updateContractSectionConfirmationStatus(rejectConfirmation, socket);
            $('.draft-reject[data-id="' + rejectConfirmation.messageId + '"]').parent().addClass(displayNoneClass);
        }
    });

    $("#formMeetingOutcomes").validate({
        submitHandler: function (form) {
            submitMeetingOutcomes();
        }
    });

    /**
     * @description
     */
    function setCounterPartyUserTagLists() {
        $('#messageInputCounterParty').atwho({
            at: "@",
            data: counterpartyUserList,
            displayTpl: "<li class='sameside-list'>${name}</li>",
            insertTpl: '<a href="#" data-type="mentionable" data-id="${id}" data-companyid="${companyId}" data-name="${name}">@${name}</a>',
            callbacks: {
                beforeInsert: function (value, $li) {
                    var match = value.match(/data-id="([0-9a-f]+)"/);
                    var match2 = value.match(/data-companyid="([0-9a-f]+)"/);
                    if (match && match2) {
                        var dataIdValue = match[1];
                        var dataCompanyIdValue = match2[1];
                        tagUserInMessage.push({"userId": dataIdValue, "companyId": dataCompanyIdValue});
                    }
                    return value;
                }
            }
        });
    }

    /**
     * @description
     * @param userID
     * @param userName
     */
    function updateAssignDraftRequestDropdown(userID, userName) {
        elements.assignDraftingRequestUserId.value = userID;
        elements.assignDraftingRequestInput.value = userName;
        elements.assignDraftingRequestInput.placeholder = userName;
    }
    /**====================== Section: Counterparty chat ======================*/


    /**================== Other Function Start ========================*/
    /**
     * @description This function will be used for the get contract id from callback url
     * @param url
     * @returns {*|string}
     */
    function getContractID(url) {
        var urlArr = url.split('/');
        return urlArr[8];
    }

    /**
     * @description This function will be used for the get contract mode from callback url
     * @param url
     * @returns {*|string}
     */
    function getContractMode(url) {
        var urlArr = url.split('/');
        return urlArr[10];
    }

    /**
     * @description This function is used for geeting the params from URL and it is used for development
     * @param name
     * @returns {string | null}
     */
    function getURLParameter(name) {
        return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [null, ''])[1].replace(/\+/g, '%20')) || null;
    }

    /**
     * @description This function will return the chat room name
     * @param withType
     * @returns {string}
     */
    function getChatRoom(withType) {
        switch (withType) {
            case 'Our Team':
                return 'user_' + loggedInCompanyDetails._id + '_' + selectedThreadID;
                break;
            case 'Counterparty':
                return "counterparty_" + selectedThreadID
                break;
            case 'Conversion History':
                return 'conversionHistory_' + selectedThreadID
                break;
            default:
                return 'conversionHistory_' + selectedThreadID
                break;
        }
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
    }

    /**
     * @description This function is used for formatting date
     * @param inputDate
     * @returns {string}
     */
    function formatDate(inputDate) {
        var months = [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];

        var date = new Date(inputDate);
        var day = date.getDate();
        var month = months[date.getMonth()];
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var period = hours >= 12 ? "PM" : "AM";
        var formattedHours = hours % 12 || 12;

        var daySuffix;
        if (day === 1 || day === 21 || day === 31) {
            daySuffix = "st";
        } else if (day === 2 || day === 22) {
            daySuffix = "nd";
        } else if (day === 3 || day === 23) {
            daySuffix = "rd";
        } else {
            daySuffix = "th";
        }

        var formattedDate = `${day}<sup>${daySuffix}</sup> ${month} ${formattedHours}:${minutes.toString().padStart(2, '0')} ${period}`;
        return formattedDate;
    }

    /**
     * @param inputDate
     * @returns {string}
     */
    function formatDateForMeeting(inputDate) {
        var months = [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];
        var daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        var date = new Date(inputDate);
        var day = daysOfWeek[date.getDay()];
        var dateT = date.getDate();
        var month = months[date.getMonth()];
        var formattedDate = `${day}, ${dateT} ${month}`;
        return formattedDate;
    }

    /**
     * @description This function is used for the close all the bottom popups
     */
    function closeBottomPopup() {
        elements.formSendPositionConfirmation.reset();
        elements.formRejectPosition.reset();
        elements.formAssignDraftRequest.reset();
        elements.formSendDraftConfirmation.reset();
        elements.formRejectDraftRequest.reset();
        elements.formRejectDraft.reset();
        elements.formMeetingOutcomes.reset();
        switchClass(elements.inviteUserPopup, displayNoneClass, true);
        switchClass(elements.inviteTeamPopup, displayNoneClass, true);
        switchClass(elements.sendPositionConfirmationPopup, displayNoneClass, true);
        switchClass(elements.confirmPositionPopup, displayNoneClass, true);
        switchClass(elements.rejectPositionPopup, displayNoneClass, true);
        switchClass(elements.assignDraftRequestPopup, displayNoneClass, true);
        switchClass(elements.sendDraftConfirmationPopup, displayNoneClass, true);
        switchClass(elements.rejectDarftRequestPopup, displayNoneClass, true);
        switchClass(elements.rejectDarftPopup, displayNoneClass, true);
        switchClass(elements.meetingPopup, displayNoneClass, true);
        switchClass(elements.divMeetingViewOutcomes, displayNoneClass, true);
        switchClass(elements.divMeetingEnterOutcomes, displayNoneClass, true);
    }

    /**
     * @description This function will be used for redirect to clause list page from create clause
     */
    function redirectToClauseList() {
        $("#formClause").validate().resetForm();
        elements.formClause.reset();
        if ($('#inviteteams').prop('checked')) {
            $('#inviteteams').click();
        }
        if ($('#inviteusers').prop('checked')) {
            $('#inviteusers').click();
        }
        var placeholderText = 'Select users and teams';
        elements.inputInviteUsersTeams.placeholder = placeholderText;
        $('#inputInviteUsersTeams').click();
        $('#collapseTeams, #collapseUsers').collapse('hide');
        switchClass(elements.sectionCreateClause, displayNoneClass, true);
        switchClass(elements.sectionContractLists, displayNoneClass, false);
    }

    /**
     * Update invite team checkbox
     */
    function updateInviteCheckbox() {
        $('.team-chkbox').each(function () {
            var isChecked = $(this).prop("checked");
            var dataID = $(this).parent().data('id');
            var jsonData = inviteTeamListIDs.find((ele) => ele.itemId == dataID);
            if (isChecked) {
                if (selectedInviteTeams.findIndex((ele) => ele.itemId == jsonData.itemId) < 0) {
                    selectedInviteTeams.push(jsonData);
                }
            } else {
                if (selectedInviteTeams.findIndex((ele) => ele.itemId == jsonData.itemId) > -1) {
                    selectedInviteTeams = $.grep(selectedInviteTeams, function (value) {
                        return value.itemId != dataID;
                    });
                }
            }
        });
        $('.user-chkbox').each(function () {
            var isChecked = $(this).prop("checked");
            var dataID = $(this).parent().data('id');
            var jsonData = inviteUserListIDs.find((ele) => ele.itemId == dataID);
            if (isChecked) {
                if (selectedInviteUsers.findIndex((ele) => ele.itemId == jsonData.itemId) < 0) {
                    selectedInviteUsers.push(jsonData);
                }
            } else {
                if (selectedInviteUsers.findIndex((ele) => ele.itemId == jsonData.itemId) > -1) {
                    selectedInviteUsers = $.grep(selectedInviteUsers, function (value) {
                        return value.itemId != dataID;
                    });
                }
            }
        });
        updateInvitePlacehoder();
    }

    /**
     * @description Update the placeholder of Invite user input
     */
    function updateInvitePlacehoder() {
        var placeholderText = 'Select users and teams';
        var placeholderTextArray = [];
        if (selectedInviteUsers && selectedInviteUsers.length > 0) {
            placeholderTextArray.push(selectedInviteUsers.length + (selectedInviteUsers.length == 1 ? ' User' : ' Users'));
        }
        if (selectedInviteTeams && selectedInviteTeams.length > 0) {
            placeholderTextArray.push(selectedInviteTeams.length + (selectedInviteTeams.length == 1 ? ' Team' : ' Teams'));
        }
        if (placeholderTextArray.length > 0) {
            placeholderText = placeholderTextArray.join(' and ') + ' Selected';
        }
        elements.inputInviteUsersTeams.placeholder = placeholderText;
    }

    /**================== Other Function End  =========================*/

    /**================== Socket Function Start  =========================*/
    /**
     * @description This function is used for setup socket on event
     */
    function setupSocket() {
        if (!flagSocketFunctionInit) {

            var chatRoomName = loggedInUserDetails._id + "_" + contractID;
            socket.emit('joinChatRoom', chatRoomName);

            var chatRoomNameA = 'room_' + contractID;
            socket.emit('joinChatRoom', chatRoomNameA);

            var documentChatRoomName = contractID;
            socket.emit('joinChatRoom', documentChatRoomName);

            socket.on('counterpartyInvited', data => {
                if (data) {
                    getContractDetails(socket, redirection = true);
                }
            });

            socket.on('forwardNewClauseCreated', async function (data) {
                // debugger;
                if (data) {
                    tagLists.push(JSON.parse(data));
                    clauseNextPage = 1;
                    clauseHasNextPage = true;
                    clauseLists = [];
                    await getClauses();
                }
            });

            socket.on('forwardInviteClause', async function (data) {
                if (data) {
                    clauseNextPage = 1;
                    clauseHasNextPage = true;
                    clauseLists = [];
                    await getClauses();
                }
            });

            socket.on('forwardConversionHistoryMessage', data => {
                if (elements.sectionContractLists.classList.contains(displayNoneClass)) {
                    unreadMessageForThread()
                }
                renderSocketHistoryMessage(data, 'CH');
            });

            socket.on('forwardContractSectionMessage', data => {
                if (elements.sectionContractLists.classList.contains(displayNoneClass)) {
                    unreadMessageForThread()
                }
                renderSocketMessage(data, 'SS');

            });

            socket.on('forwardCounterContractSectionMessage', data => {
                if (elements.sectionContractLists.classList.contains(displayNoneClass)) {
                    unreadMessageForThread()
                }
                renderSocketMessage(data, 'CP');
            });

            /** Socket On: user typing for same side */
            socket.on('userTypingNotificationContractSection', data => {
                if (data) {
                    if (tyingUserSSArray.findIndex(x => x == data) == -1) {
                        tyingUserSSArray.push(data);
                    }
                    var text = '';
                    if (tyingUserSSArray.length == 1) {
                        text = tyingUserSSArray[0] + " is typing...";
                    }
                    if (tyingUserSSArray.length == 2) {
                        text = tyingUserSSArray[0] + " and " + tyingUserSSArray[1] + " is typing...";
                    }
                    if (tyingUserSSArray.length > 2) {
                        var otherUserCount = tyingUserSSArray.length - 2
                        text = tyingUserSSArray[0] + ", " + tyingUserSSArray[1] + " and " + otherUserCount + " others are typing...";
                    }

                    clearTimeout(typingTimeout);
                    document.getElementById('typingSpan').textContent = text;
                }
                typingTimeout = setTimeout(() => {
                    document.getElementById('typingSpan').textContent = '';
                    tyingUserSSArray = [];
                }, 2000);
            });

            /** Socket On: user typing for counterparty side */
            socket.on('userTypingNotificationCounterContractSection', data => {
                if (data) {
                    if (tyingUserCPArray.findIndex(x => x == data) == -1) {
                        tyingUserCPArray.push(data);
                    }
                    var text = '';
                    if (tyingUserCPArray.length == 1) {
                        text = tyingUserCPArray[0] + " is typing...";
                    }
                    if (tyingUserCPArray.length == 2) {
                        text = tyingUserCPArray[0] + " and " + tyingUserCPArray[1] + " is typing...";
                    }
                    if (tyingUserCPArray.length > 2) {
                        var otherUserCount = tyingUserCPArray.length - 2
                        text = tyingUserCPArray[0] + ", " + tyingUserCPArray[1] + " and " + otherUserCount + " others are typing...";
                    }

                    clearTimeout(typingTimeout);
                    document.getElementById('typingSpanCP').textContent = text;
                }
                typingTimeout = setTimeout(() => {
                    document.getElementById('typingSpanCP').textContent = '';
                    tyingUserCPArray = [];
                }, 2000);
            });

            socket.on('forwardRefreshClauseList', async function (data) {
                if (data) {
                    if (typeof window.Asc.plugin.executeMethod === 'function') {
                        window.Asc.plugin.executeMethod("GetAllContentControls");
                    }
                    clauseNextPage = 1;
                    clauseHasNextPage = true;
                    clauseLists = [];
                    await getClauses();
                }
            });

            flagSocketFunctionInit = true;
        }
    }

    function renderSocketMessage(data, chatWindow) {
        // debugger;
        var renderHTML = '';
        switch (data.messageType) {
            case "Invite":
                var message = "";
                if (data.invitedUserName) {
                    message += data.invitedUserName.trim() + " invited by " + data.actionperformedbyUser.trim() + " in this contract section";
                } else {
                    message += data.invitedTeamName.trim() + " invited by " + data.actionperformedbyUser.trim() + " in this contract section";
                }
                renderHTML += '<strong class="message-wrapper grey-color">\n' +
                    '   <div class="profile-picture">\n' +
                    '      <img src="' + (data.actionperformedbyUserImage ? IMAGE_USER_PATH_LINK + data.actionperformedbyUserImage : 'images/no-profile-image.jpg') + '" alt="pp">\n' +
                    '      <p class="name">' + data.actionperformedbyUser + '</p>\n' +
                    '      <p class="last-seen">' + formatDate(new Date()) + '</p>\n' +
                    '   </div>\n' +
                    '   <strong>\n' + message + '</strong>\n' +
                    '</div>\n'
                break;
            case "Position Confirmation":
                renderHTML += '<div class="message-wrapper' + (chatWindow == 'SS' ? " grey-color" : " dark-gold-color") + (data && data.messageStatus && data.messageStatus == 'Reject' ? " red-color" : "") + '">\n' +
                    '       <div class="profile-picture">\n' +
                    '           <img src="' + (data.actionperformedbyUserImage ? IMAGE_USER_PATH_LINK + data.actionperformedbyUserImage : 'images/no-profile-image.jpg') + '" alt="pp">\n' +
                    '           <p class="name">' + data.actionperformedbyUser + '</p>\n' +
                    '           <p class="last-seen">' + formatDate(new Date()) + '</p>\n' +
                    '       </div>\n' +
                    '       <div class="request-row">\n' +
                    '           <div class="' + (chatWindow == 'SS' ? "request-content" : "message-content") + '">\n' +
                    '               <h4>' + (data.messageStatus == 'None' || data.messageStatus == 'Updated' ? 'Sent a position confirmation <br/> request' : (data.messageStatus == 'Approve' ? 'Position confirmation approved' : 'Position confirmation rejected')) + '</h4>\n' +
                    '               <div class="' + (chatWindow == 'SS' ? "content-message" : "message") + '">' + (data.message ? data.message.trim().replaceAll(/\n/g, '<br>') : '') + '</div>\n' +
                    '           </div>\n';
                if (chatWindow == 'CP') {
                    if (data.from != loggedInUserDetails._id && data.companyId != loggedInCompanyDetails._id && data.messageStatus == 'None' && openContractResponseData.canConfirmPosition) {
                        renderHTML += '        <div class="request-btn">\n' +
                            '               <button class="btn btn-primary ' + (data.with != 'Counterparty' ? "approve-possition" : "reconfirm-approve") + '" data-action="Approve" data-id="' + data._id + '" >Approve</button>\n' +
                            '               <button class="btn reject-btn reconfirm-reject" data-action="Reject"  data-id="' + data._id + '" >Reject</button>\n' +
                            '           </div>\n';
                    }
                } else {
                    if (data.from != loggedInUserDetails._id && data.messageStatus == 'None' && openContractResponseData.canConfirmPosition) {
                        renderHTML += '        <div class="request-btn">\n' +
                            '               <button class="btn btn-primary ' + (data.with != 'Counterparty' ? "approve-possition" : "reconfirm-approve") + '" data-action="Approve" data-id="' + data._id + '" >Approve</button>\n' +
                            '               <button class="btn reject-btn reconfirm-reject" data-action="Reject"  data-id="' + data._id + '" >Reject</button>\n' +
                            '           </div>\n';
                    }
                }
                renderHTML += '    </div>\n' +
                    '</div>\n';
                break;
            case "Draft Confirmation":
                renderHTML += '<div class="message-wrapper' + (chatWindow == 'SS' ? " grey-color" : " dark-gold-color") + '">\n' +
                    '   <div class="profile-picture">\n' +
                    '           <img src="' + (data.actionperformedbyUserImage ? IMAGE_USER_PATH_LINK + data.actionperformedbyUserImage : 'images/no-profile-image.jpg') + '" alt="pp">\n' +
                    '           <p class="name">' + data.actionperformedbyUser + '</p>\n' +
                    '           <p class="last-seen">' + formatDate(new Date()) + '</p>\n' +
                    '   </div>\n' +
                    '   <div class="request-row">\n' +
                    '      <div class="' + (chatWindow == 'SS' ? "request-content" : "message-content") + '">\n' +
                    '         <h4>Draft confirmation request</h4>\n' +
                    '         <div class="' + (chatWindow == 'SS' ? "content-message" : "message") + '">' + (data.message ? data.message.trim().replaceAll(/\n/g, '<br>') : '') + '</div>\n' +
                    '      </div>';
                if (data.companyId != loggedInCompanyDetails._id && openContractResponseData.canConfirmPosition) {
                    renderHTML += '      <div class="request-btn">\n' +
                        '         <button class="btn btn-primary draft-approve" data-action="Approve" data-id="' + data._id + '">Approve</button>\n' +
                        '         <button class="btn reject-btn  draft-reject " data-action="Reject" data-id="' + data._id + '">Reject</button>\n' +
                        '      </div>';
                }
                renderHTML += '   </div>\n' +
                    '</div>';
                break;
            case "Notification":
                var requestRowMessage = '';
                if (data.confirmationType == 'position') {
                    $('.reconfirm-approve[data-id="' + data.messageId + '"]').parent().addClass(displayNoneClass);
                    requestRowMessage = (data.status == "approved" ? 'Position approved by ' : 'Position rejected by ') + data.actionperformedbyUser
                } else if (data.confirmationType == 'request_draft' && data.sendTo) {
                    requestRowMessage = data.actionperformedbyUser + ' has assigned a team member to draft this contract section';
                    $('.reconfirm-approve[data-id="' + data.messageId + '"]').parent().addClass(displayNoneClass);
                } else if (data.confirmationType == "draft") {
                    if (data.status == 'approved') {
                        getContractSectionDetails();
                        getContractDetails(socket, redirection = false);
                        requestRowMessage = 'Draft confirmation request approved by ' + data.actionperformedbyUser;
                    } else {
                        requestRowMessage = 'Draft confirmation request rejected by ' + data.actionperformedbyUser;
                    }
                    $('.draft-reject[data-id="' + data.messageId + '"]').parent().addClass(displayNoneClass);
                } else if (data.confirmationType == "assign_draft") {
                    getContractSectionDetails();
                    getContractDetails(socket, false);
                    requestRowMessage = data.actionperformedbyUser + ' has assigned ' + data.sendToName + ' to draft this contract section';
                } else if (data.confirmationType == "withdrawn") {
                    renderHTML += '<div class="message-wrapper grey-color ' + (data.with == "Counterparty" ? "light-gold-color" : "") + '">\n' +
                        '   <div class="profile-picture">\n' +
                        '      <img src="' + (data.actionperformedbyUserImage ? IMAGE_USER_PATH_LINK + data.actionperformedbyUserImage : 'images/no-profile-image.jpg') + '" alt="pp">\n' +
                        '      <p class="name">' + data.actionperformedbyUser + '</p>\n' +
                        '      <p class="last-seen">' + formatDate(new Date()) + '</p>\n' +
                        '   </div>\n' +
                        '   <div class="request-row">\n' +
                        '      <div class="message">Contract section withdrawn by ' + data.actionperformedbyUser + '</div>\n' +
                        '   </div>\n' +
                        '</div>\n';
                    switchClass(elements.divSameSideTextbox, displayNoneClass, true);
                    switchClass(elements.divCounterpartyTextbox, displayNoneClass, true);
                    var actionSameSide = document.querySelectorAll('.action-sameside');
                    actionSameSide.forEach(function (element) {
                        element.classList.add(displayNoneClass);
                    });
                    var actionCounterparty = document.querySelectorAll('.action-counterparty');
                    actionCounterparty.forEach(function (element) {
                        element.classList.add(displayNoneClass);
                    });
                    if (chatWindow !== 'SS') {
                        let htmlA = '';
                        htmlA += '<div class="chat-typing-area" id="draftConfirmCP">\n' +
                            '   <div class="position-text">This contract section has been withdrawn by ' + data.actionperformedbyUser + '</div>\n';
                        if (openContractResponseData.userRole == "Admin" || openContractResponseData.userRole == "Contract Creator" || openContractResponseData.userRole == "Counterparty" || openContractResponseData.userRole == "Position Confirmer") {
                            htmlA += '   <div class="btn-box btn-box-re-open"><button class="btn-primary btn">Re-Open</button></div>\n';
                        }
                        htmlA += '</div>';
                        var newElementA = document.createElement("div");
                        newElementA.innerHTML = htmlA;
                        elements.divChatContractCounterpartyFooter.appendChild(newElementA);
                    } else {
                        let htmlB = '';
                        htmlB += '<div class="chat-typing-area" id="draftConfirmSS">\n' +
                            '   <div class="position-text">This contract section has been withdrawn by ' + data.actionperformedbyUser + '</div>\n';
                        if (openContractResponseData.userRole == "Admin" || openContractResponseData.userRole == "Contract Creator" || openContractResponseData.userRole == "Counterparty" || openContractResponseData.userRole == "Position Confirmer") {
                            htmlB += '   <div class="btn-box btn-box-re-open"><button class="btn-primary btn">Re-Open</button></div>\n';
                        }
                        htmlB += '</div>';
                        var newElementB = document.createElement("div");
                        newElementB.innerHTML = htmlB;
                        elements.divChatContractSameSideFooter.appendChild(newElementB);
                    }
                } else if (data.confirmationType == "Reopen") {
                    requestRowMessage = 'Contract section Re-Opened by ' + data.actionperformedbyUser;
                    document.getElementById('divChatCounterPartyBody').classList.remove('contract-completed');
                    document.getElementById('divChatSameSideBody').classList.remove('contract-completed');
                    document.getElementById('divSameSideTextbox').classList.remove(displayNoneClass);
                    document.getElementById('divCounterpartyTextbox').classList.remove(displayNoneClass);
                    var actionSameSide = document.querySelectorAll('.action-sameside');
                    actionSameSide.forEach(function (element) {
                        element.classList.remove(displayNoneClass);
                    });
                    var actionCounterparty = document.querySelectorAll('.action-counterparty');
                    actionCounterparty.forEach(function (element) {
                        element.classList.remove(displayNoneClass);
                    });
                    var draftConfirmCPElement = document.getElementById("draftConfirmCP");
                    if (draftConfirmCPElement) {
                        draftConfirmCPElement.parentNode.removeChild(draftConfirmCPElement);
                    }
                    var draftConfirmSSElement = document.getElementById("draftConfirmSS");
                    if (draftConfirmSSElement) {
                        draftConfirmSSElement.parentNode.removeChild(draftConfirmSSElement);
                    }
                    getContractDetails(socket, false);
                }
                if (data.status == "rejected") {
                    renderHTML += '<div class="message-wrapper red-color">\n' +
                        '       <div class="profile-picture">\n' +
                        '           <img src="' + (data.actionperformedbyUserImage ? IMAGE_USER_PATH_LINK + data.actionperformedbyUserImage : 'images/no-profile-image.jpg') + '" alt="pp">\n' +
                        '           <p class="name">' + data.actionperformedbyUser + '</p>\n' +
                        '           <p class="last-seen">' + formatDate(new Date()) + '</p>\n' +
                        '       </div>\n' +
                        '       <div class="request-row">\n' +
                        '           <div class="request-content">\n' +
                        '               <h4>' + (data.confirmationType == 'position' ? 'Position confirmation rejected' : 'Draft confirmation rejected') + '</h4>\n' +
                        '               <div class="content-message">' + (data.message ? data.message.trim().replaceAll(/\n/g, '<br>') : '') + '</div>\n' +
                        '           </div>\n' +
                        '       </div>\n' +
                        '</div>';
                } else if (data.confirmationType == 'request_draft' && !data.sendTo) {
                    getContractSectionDetails();
                    $('.reconfirm-approve[data-id="' + data.messageId + '"]').parent().addClass(displayNoneClass);
                    getContractDetails(socket, false);
                    if (chatWindow == 'SS') {
                        renderHTML += '<div class="message-wrapper reverse">\n' +
                            '       <div class="profile-picture">\n' +
                            '           <img src="' + (data.actionperformedbyUserImage ? IMAGE_USER_PATH_LINK + data.actionperformedbyUserImage : 'images/no-profile-image.jpg') + '" alt="pp">\n' +
                            '           <p class="name">' + data.actionperformedbyUser + '</p>\n' +
                            '           <p class="last-seen">' + formatDate(new Date()) + '</p>\n' +
                            '       </div>\n' +
                            '       <div class="request-row">\n' +
                            '           <div class="request-content">\n' +
                            '               <h4>Draft Request</h4>\n' +
                            '               <div class="content-message">' + (data.message ? data.message.trim().replaceAll(/\n/g, '<br>') : '') + '</div>\n' +
                            '           </div>\n';
                        if (openContractResponseData.userRole == "Admin" || openContractResponseData.userRole == "Contract Creator") {
                            renderHTML += '        <div class="request-btn">\n' +
                                '               <button class="btn btn-primary assign-user" data-action="assign-user" data-id="' + data.messageId + '">Assign for Drafting</button>\n' +
                                '           </div>\n';
                        }
                        renderHTML += '</div>\n' +
                            '</div>';
                    } else {
                        renderHTML += '<div class="message-wrapper dark-gold-color">\n' +
                            '       <div class="profile-picture">\n' +
                            '           <img src="' + (data.actionperformedbyUserImage ? IMAGE_USER_PATH_LINK + data.actionperformedbyUserImage : 'images/no-profile-image.jpg') + '" alt="pp">\n' +
                            '           <p class="name">' + data.actionperformedbyUser + '</p>\n' +
                            '           <p class="last-seen">' + formatDate(new Date()) + '</p>\n' +
                            '       </div>\n' +
                            '       <div class="request-row">\n' +
                            '           <div class="message-content">\n' +
                            '               <h4>Draft Request</h4>\n' +
                            '               <div class="message">' + (data.message ? data.message.trim().replaceAll(/\n/g, '<br>') : '') + '</div>\n' +
                            '           </div>\n';
                        renderHTML += '</div>\n' +
                            '</div>';
                        if (data.flagDraftAssigned) {
                            requestRowMessage = data.actionperformedbyUser + ' has assigned ' + (data.assignedUserDetails ? data.assignedUserDetails.firstName + " " + data.assignedUserDetails.lastName : "") + ' to draft this contract section';
                        } else {
                            if (loggedInCompanyDetails._id == contractInformation.companyId) {
                                requestRowMessage = data.actionperformedbyUser + ' has assigned ' + (loggedInCompanyDetails._id == data.companyId ? loggedInCompanyDetails.companyName : counterPartyCompanyDetail.companyName) + ' to draft this contract section';
                            } else {
                                requestRowMessage = data.actionperformedbyUser + ' has assigned ' + (loggedInCompanyDetails._id == data.companyId ? loggedInCompanyDetails.companyName : counterPartyCompanyDetail.companyName) + ' to draft this contract section';
                            }
                        }
                    }
                }
                if (requestRowMessage) {
                    renderHTML += '<div class="message-wrapper' + (chatWindow == 'SS' ? " grey-color" : " dark-gold-color") + '">\n' +
                        '       <div class="profile-picture">\n' +
                        '           <img src="' + (data.actionperformedbyUserImage ? IMAGE_USER_PATH_LINK + data.actionperformedbyUserImage : 'images/no-profile-image.jpg') + '" alt="pp">\n' +
                        '           <p class="name">' + data.actionperformedbyUser + '</p>\n' +
                        '           <p class="last-seen">' + formatDate(new Date()) + '</p>\n' +
                        '       </div>\n' +
                        '       <div class="request-row">\n' +
                        '           <strong>' + requestRowMessage + '</strong>\n' +
                        '       </div>\n' +
                        '</div>';
                }
                break;
            case "Meeting":
                renderHTML += '<div class="scheduled-meeting" data-id="' + data.meetingId + '">\n' +
                    '          <div class="scheduled-meeting-inner">\n' +
                    '            <div class="scheduled-meeting-icon">\n' +
                    '              <img src="images/schedule-meeting-icon.svg"\n' +
                    '                alt="Schedule Meeting Icon" />\n' +
                    '            </div>\n' +
                    '            <div class="scheduled-meeting-content">\n' +
                    '              <h3>' + data.meetingTitle + '</h3>\n' +
                    '              <p>Scheduled Meeting</p>\n' +
                    '              <span>' + formatDateForMeeting(data.meetingDate) + ' &#183; ' + data.meetingStartTime + ' - ' + data.meetingEndTime + '</span>\n' +
                    '            </div>\n' +
                    '          </div>\n' +
                    '        </div>';
                break;
            default:
                renderHTML += '<div class="message-wrapper' + (chatWindow == 'CP' ? " light-gold-color" : "") + '">\n' +
                    '   <div class="profile-picture">\n' +
                    '      <img src="' + (data.actionperformedbyUserImage ? IMAGE_USER_PATH_LINK + data.actionperformedbyUserImage : 'images/no-profile-image.jpg') + '" alt="pp">\n' +
                    '      <p class="name">' + data.actionperformedbyUser + '</p>\n' +
                    '      <p class="last-seen">' + formatDate(new Date()) + '</p>\n' +
                    '   </div>\n' +
                    '   <div class="message-content">\n' +
                    '      <div class="message">' + (data.message ? data.message.trim().replaceAll(/\n/g, '<br>') : '') + '</div>\n' +
                    '   </div>\n' +
                    '</div>\n';
                break;
        }

        if (chatWindow == 'SS') {
            var newElement = document.createElement("div");
            newElement.innerHTML = renderHTML;
            elements.conversionSameSide.appendChild(newElement);

            var scrollPositionFromBottom = elements.divChatSameSideBody.scrollHeight - (elements.divChatSameSideBody.scrollTop + elements.divChatSameSideBody.clientHeight)
            if (scrollPositionFromBottom <= 600) {
                var scrollToOptions = {
                    top: elements.divChatSameSideBody.scrollHeight,
                    behavior: 'smooth'
                };
                elements.divChatSameSideBody.scrollTo(scrollToOptions);
            }
        } else {
            var newElement = document.createElement("div");
            newElement.innerHTML = renderHTML;
            elements.conversionCounterparty.appendChild(newElement);

            var scrollPositionFromBottom = elements.divChatCounterPartyBody.scrollHeight - (elements.divChatCounterPartyBody.scrollTop + elements.divChatCounterPartyBody.clientHeight)
            if (scrollPositionFromBottom <= 600) {
                var scrollToOptions = {
                    top: elements.divChatCounterPartyBody.scrollHeight,
                    behavior: 'smooth'
                };
                elements.divChatCounterPartyBody.scrollTo(scrollToOptions);
            }
        }
    }

    function renderSocketHistoryMessage(data, chatWindow) {
        // debugger;
        if (loggedInCompanyDetails._id != contractInformation.companyId) {
            var conversionTypeArr = ['OTCP'];
            if (openContractResponseData && openContractResponseData.canCommunicateWithCounterparty) {
                conversionTypeArr.push('OTM');
            }
            if (!conversionTypeArr.includes(data.conversationType)) {
                return false;
            }
        } else {
            var conversionTypeArr = ['OTCC'];
            if (openContractResponseData && openContractResponseData.canCommunicateWithCounterparty) {
                conversionTypeArr.push('OTM');
            }
            if (!conversionTypeArr.includes(data.conversationType)) {
                return false;
            }
        }

        var renderHTML = '';
        switch (data.messageType) {
            case "Invite":
                var message = "";
                if (data.invitedUserName) {
                    message += data.invitedUserName.trim() + " invited by " + data.actionperformedbyUser.trim() + " in this contract section";
                } else {
                    message += data.invitedTeamName.trim() + " invited by " + data.actionperformedbyUser.trim() + " in this contract section";
                }
                renderHTML += '<strong class="message-wrapper reverse">\n' +
                    '   <div class="profile-picture">\n' +
                    '      <img src="' + (data.actionperformedbyUserImage ? IMAGE_USER_PATH_LINK + data.actionperformedbyUserImage : 'images/no-profile-image.jpg') + '" alt="pp">\n' +
                    '      <p class="name">' + data.actionperformedbyUser + '</p>\n' +
                    '      <p class="last-seen">' + formatDate(new Date()) + '</p>\n' +
                    '   </div>\n' +
                    '   <strong>\n' + message + '</strong>\n' +
                    '</div>\n'
                break;
            case "Position Confirmation":
                renderHTML += '<div class="message-wrapper' + (data.chatWindow !== 'Counterparty' ? " grey-color reverse" : " dark-gold-color") + (data && data.messageStatus && data.messageStatus == 'Reject' ? " red-color" : "") + '">\n' +
                    '       <div class="profile-picture">\n' +
                    '           <img src="' + (data.actionperformedbyUserImage ? IMAGE_USER_PATH_LINK + data.actionperformedbyUserImage : 'images/no-profile-image.jpg') + '" alt="pp">\n' +
                    '           <p class="name">' + data.actionperformedbyUser + '</p>\n' +
                    '           <p class="last-seen">' + formatDate(new Date()) + '</p>\n' +
                    '       </div>\n' +
                    '       <div class="request-row">\n' +
                    '           <div class="' + (data.chatWindow !== 'Counterparty' ? "request-content" : "message-content") + '">\n' +
                    '               <h4>' + (data.messageStatus == 'None' || data.messageStatus == 'Updated' ? 'Sent a position confirmation <br/> request' : (data.messageStatus == 'Approve' ? 'Position confirmation approved' : 'Position confirmation rejected')) + '</h4>\n' +
                    '               <div class="' + (data.chatWindow !== 'Counterparty' ? "content-message" : "message") + '">' + (data.message ? data.message.trim().replaceAll(/\n/g, '<br>') : '') + '</div>\n' +
                    '           </div>\n';
                renderHTML += '    </div>\n' +
                    '</div>\n';
                break;
            case "Draft Confirmation":
                renderHTML += '<div class="message-wrapper' + (data.chatWindow !== 'Counterparty' ? " grey-color reverse" : " dark-gold-color") + '">\n' +
                    '   <div class="profile-picture">\n' +
                    '           <img src="' + (data.actionperformedbyUserImage ? IMAGE_USER_PATH_LINK + data.actionperformedbyUserImage : 'images/no-profile-image.jpg') + '" alt="pp">\n' +
                    '           <p class="name">' + data.actionperformedbyUser + '</p>\n' +
                    '           <p class="last-seen">' + formatDate(new Date()) + '</p>\n' +
                    '   </div>\n' +
                    '   <div class="request-row">\n' +
                    '      <div class="' + (data.chatWindow !== 'Counterparty' ? "request-content" : "message-content") + '">\n' +
                    '         <h4>Draft confirmation request</h4>\n' +
                    '         <div class="' + (data.chatWindow !== 'Counterparty' ? "content-message" : "message") + '">' + (data.message ? data.message.trim().replaceAll(/\n/g, '<br>') : '') + '</div>\n' +
                    '      </div>\n' +
                    '   </div>\n' +
                    '</div>';
                break;
            case "Notification":
                var requestRowMessage = '';
                if (data.confirmationType == 'position') {
                    requestRowMessage = (data.status == "approved" ? 'Position approved by ' : 'Position rejected by ') + data.actionperformedbyUser
                } else if (data.confirmationType == 'request_draft' && data.sendTo) {
                    requestRowMessage = data.actionperformedbyUser + ' has assigned a team member to draft this contract section';
                } else if (data.confirmationType == "draft") {
                    if (data.status == 'approved') {
                        getContractSectionDetails();
                        getContractDetails(socket, redirection = false);
                        requestRowMessage = 'Draft confirmation request approved by ' + data.actionperformedbyUser;
                    } else {
                        requestRowMessage = 'Draft confirmation request rejected by ' + data.actionperformedbyUser;
                    }
                } else if (data.confirmationType == "assign_draft") {
                    getContractDetails(socket, false);
                    requestRowMessage = data.actionperformedbyUser + ' has assigned ' + data.sendToName + ' to draft this contract section';
                } else if (data.confirmationType == "withdrawn") {
                    requestRowMessage = 'Contract section withdrawn by ' + data.actionperformedbyUser;
                } else if (data.confirmationType == "Reopen") {
                    requestRowMessage = 'Contract section Re-Opened by ' + data.actionperformedbyUser;
                    document.getElementById('divChatCounterPartyBody').classList.remove('contract-completed');
                    document.getElementById('divChatSameSideBody').classList.remove('contract-completed');
                    document.getElementById('divSameSideTextbox').classList.remove(displayNoneClass);
                    document.getElementById('divCounterpartyTextbox').classList.remove(displayNoneClass);
                    var actionSameSide = document.querySelectorAll('.action-sameside');
                    actionSameSide.forEach(function (element) {
                        element.classList.remove(displayNoneClass);
                    });
                    var actionCounterparty = document.querySelectorAll('.action-counterparty');
                    actionCounterparty.forEach(function (element) {
                        element.classList.remove(displayNoneClass);
                    });
                    var draftConfirmCPElement = document.getElementById("draftConfirmCP");
                    if (draftConfirmCPElement) {
                        draftConfirmCPElement.parentNode.removeChild(draftConfirmCPElement);
                    }
                    var draftConfirmSSElement = document.getElementById("draftConfirmSS");
                    if (draftConfirmSSElement) {
                        draftConfirmSSElement.parentNode.removeChild(draftConfirmSSElement);
                    }
                    getContractDetails(socket, false);
                }
                if (data.status == "rejected") {
                    renderHTML += '<div class="message-wrapper red-color' + (data.chatWindow !== 'Counterparty' ? " reverse" : "") + '">\n' +
                        '       <div class="profile-picture">\n' +
                        '           <img src="' + (data.actionperformedbyUserImage ? IMAGE_USER_PATH_LINK + data.actionperformedbyUserImage : 'images/no-profile-image.jpg') + '" alt="pp">\n' +
                        '           <p class="name">' + data.actionperformedbyUser + '</p>\n' +
                        '           <p class="last-seen">' + formatDate(new Date()) + '</p>\n' +
                        '       </div>\n' +
                        '       <div class="request-row">\n' +
                        '           <div class="request-content">\n' +
                        '               <h4>' + (data.confirmationType == 'position' ? 'Position confirmation rejected' : 'Draft confirmation rejected') + '</h4>\n' +
                        '               <div class="content-message">' + (data.message ? data.message.trim().replaceAll(/\n/g, '<br>') : '') + '</div>\n' +
                        '           </div>\n' +
                        '       </div>\n' +
                        '</div>';
                } else if (data.confirmationType == 'request_draft' && !data.sendTo) {
                    if (data.chatWindow !== 'Counterparty') {
                        renderHTML += '<div class="message-wrapper reverse">\n' +
                            '       <div class="profile-picture">\n' +
                            '           <img src="' + (data.actionperformedbyUserImage ? IMAGE_USER_PATH_LINK + data.actionperformedbyUserImage : 'images/no-profile-image.jpg') + '" alt="pp">\n' +
                            '           <p class="name">' + data.actionperformedbyUser + '</p>\n' +
                            '           <p class="last-seen">' + formatDate(new Date()) + '</p>\n' +
                            '       </div>\n' +
                            '       <div class="request-row">\n' +
                            '           <div class="request-content">\n' +
                            '               <h4>Draft Request</h4>\n' +
                            '               <div class="content-message">' + (data.message ? data.message.trim().replaceAll(/\n/g, '<br>') : '') + '</div>\n' +
                            '           </div>\n';
                        if (openContractResponseData.userRole == "Admin" || openContractResponseData.userRole == "Contract Creator") {
                            renderHTML += '        <div class="request-btn">\n' +
                                '               <button class="btn btn-primary assign-user" data-action="assign-user" data-id="' + data._id + '">Assign for Drafting</button>\n' +
                                '           </div>\n';
                        }
                        renderHTML += '</div>\n' +
                            '</div>';
                    } else {
                        renderHTML += '<div class="message-wrapper dark-gold-color">\n' +
                            '       <div class="profile-picture">\n' +
                            '           <img src="' + (data.actionperformedbyUserImage ? IMAGE_USER_PATH_LINK + data.actionperformedbyUserImage : 'images/no-profile-image.jpg') + '" alt="pp">\n' +
                            '           <p class="name">' + data.actionperformedbyUser + '</p>\n' +
                            '           <p class="last-seen">' + formatDate(new Date()) + '</p>\n' +
                            '       </div>\n' +
                            '       <div class="request-row">\n' +
                            '           <div class="message-content">\n' +
                            '               <h4>Draft Request</h4>\n' +
                            '               <div class="message">' + (data.message ? data.message.trim().replaceAll(/\n/g, '<br>') : '') + '</div>\n' +
                            '           </div>\n';
                        renderHTML += '</div>\n' +
                            '</div>';
                        if (data.flagDraftAssigned) {
                            requestRowMessage = data.actionperformedbyUser + ' has assigned ' + (data.assignedUserDetails ? data.assignedUserDetails.firstName + " " + data.assignedUserDetails.lastName : "") + ' to draft this contract section';
                        } else {
                            if (loggedInCompanyDetails._id == contractInformation.companyId) {
                                requestRowMessage = data.actionperformedbyUser + ' has assigned ' + (loggedInCompanyDetails._id == data.companyId ? counterPartyCompanyDetail.companyName : loggedInCompanyDetails.companyName) + ' to draft this contract section';
                            } else {
                                requestRowMessage = data.actionperformedbyUser + ' has assigned ' + (loggedInCompanyDetails._id == data.companyId ? counterPartyCompanyDetail.companyName : loggedInCompanyDetails.companyName) + ' to draft this contract section';
                            }
                        }
                    }
                }
                if (requestRowMessage) {
                    renderHTML += '<div class="message-wrapper' + (data.chatWindow !== 'Counterparty' ? " grey-color reverse" : " dark-gold-color") + '">\n' +
                        '       <div class="profile-picture">\n' +
                        '           <img src="' + (data.actionperformedbyUserImage ? IMAGE_USER_PATH_LINK + data.actionperformedbyUserImage : 'images/no-profile-image.jpg') + '" alt="pp">\n' +
                        '           <p class="name">' + data.actionperformedbyUser + '</p>\n' +
                        '           <p class="last-seen">' + formatDate(new Date()) + '</p>\n' +
                        '       </div>\n' +
                        '       <div class="request-row">\n' +
                        '           <strong>' + requestRowMessage + '</strong>\n' +
                        '       </div>\n' +
                        '</div>';
                }
                break;
            case "Meeting":
                renderHTML += '<div class="scheduled-meeting" data-id="' + data.meetingId + '">\n' +
                    '          <div class="scheduled-meeting-inner">\n' +
                    '            <div class="scheduled-meeting-icon">\n' +
                    '              <img src="images/schedule-meeting-icon.svg"\n' +
                    '                alt="Schedule Meeting Icon" />\n' +
                    '            </div>\n' +
                    '            <div class="scheduled-meeting-content">\n' +
                    '              <h3>' + data.meetingTitle + '</h3>\n' +
                    '              <p>Scheduled Meeting</p>\n' +
                    '              <span>' + formatDateForMeeting(data.meetingDate) + ' &#183; ' + data.meetingStartTime + ' - ' + data.meetingEndTime + '</span>\n' +
                    '            </div>\n' +
                    '          </div>\n' +
                    '        </div>';
                break;
            default:
                renderHTML += '<div class="message-wrapper' + (data.chatWindow == 'Counterparty' ? " light-gold-color" : " reverse") + '">\n' +
                    '   <div class="profile-picture">\n' +
                    '      <img src="' + (data.actionperformedbyUserImage ? IMAGE_USER_PATH_LINK + data.actionperformedbyUserImage : 'images/no-profile-image.jpg') + '" alt="pp">\n' +
                    '      <p class="name">' + data.actionperformedbyUser + '&nbsp;<small>' + (data && data.actionperformedbyUserRole ? '(' + data.actionperformedbyUserRole + ')' : '') + '</small>' + '</p>\n' +
                    '      <p class="last-seen">' + formatDate(new Date()) + '</p>\n' +
                    '   </div>\n' +
                    '   <div class="message-content">\n' +
                    '      <div class="message">' + (data.message ? data.message.trim().replaceAll(/\n/g, '<br>') : '') + '</div>\n' +
                    '   </div>\n' +
                    '</div>\n';
                break;
        }

        var newHistoryElement = document.createElement("div");
        newHistoryElement.innerHTML = renderHTML;
        elements.conversionHistory.appendChild(newHistoryElement);
        var scrollPositionFromBottom = elements.divChatHistoryBody.scrollHeight - (elements.divChatHistoryBody.scrollTop + elements.divChatHistoryBody.clientHeight)
        if (scrollPositionFromBottom <= 600) {
            var scrollToOptions = {
                top: elements.divChatHistoryBody.scrollHeight,
                behavior: 'smooth'
            };
            elements.divChatHistoryBody.scrollTo(scrollToOptions);
        }
    }
    /**==================  Socket Function End  =========================*/

    /**================== API Start  =========================*/
    /**
     * @description This function will used for get the contract details and did the initial view settings of the plugin after getting the response
     * @param socket
     * @param redirection
     */
    async function getContractDetails(socket, redirection = true) {
        try {
            flagInit = true;
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
                        openContractResponseData = responseData;
                        contractInformation = responseData.openContractDetails;
                        loggedInUserDetails = responseData.loggedInUserDetails;
                        loggedInCompanyDetails = responseData.loggedInCompanyDetails;
                        switchClass(elements.btnCreateClause, displayNoneClass, (contractInformation && contractInformation.contractCurrentStatus != "Under Negotiation"));
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
                        flagInit = true;
                        if (selectedClauseID) {
                            // TODO: Set tooltip based on loggedin user roles
                            /*var getClauseDetails = clauseLists.find((ele) => ele._id == selectedClauseID);
                            if (contractInformation && responseData.canSendPositionConfirmation && getClauseDetails && getClauseDetails.isSectionInDraftMode) {
                                if (contractInformation.userWhoHasEditAccess == loggedInUserDetails._id || responseData.userRole == "Counterparty" || responseData.userRole == "Contract Creator" || responseData.userRole == "Admin") {
                                    document.getElementById('btnSendPositionConfirmationCounterparty').setAttribute('title', 'Send for Draft Confirmation');
                                } else {
                                    document.getElementById('btnSendPositionConfirmationCounterparty').setAttribute('title', 'Send for Position Confirmation');
                                }
                            } else {
                                document.getElementById('btnSendPositionConfirmationCounterparty').setAttribute('title', 'Send for Position Confirmation');
                            }*/
                        } else {
                            // TODO: Set tooltip based on loggedin user roles
                            // document.getElementById('btnSendPositionConfirmationCounterparty').setAttribute('title', 'Send for Position Confirmation');
                        }
                        document.title = "ProPact | " + loggedInUserDetails.firstName + " " + loggedInUserDetails.lastName + " " + responseData.userRole;
                        if (loggedInUserDetails) {
                            // TODO: Set logged in user images in details screen
                            // set logged-in user profile picture
                            $('.loggedin-user-profile').each(function () {
                                $(this).attr('src', (loggedInUserDetails.imageKey ? IMAGE_USER_PATH_LINK + loggedInUserDetails.imageKey : 'images/no-profile-image.jpg'));
                            });
                            // set logged-in user name
                            $('.loggedin-user-name').text(loggedInUserDetails.firstName + " " + loggedInUserDetails.lastName);
                            // set logged-in user role
                            $('.loggedin-user-role').text(responseData.userRole);
                            elements.userProfileName.innerHTML += '<img src="images/icon-info.png" class="img-info">';
                            // document.getElementById('userProfileNameA').innerHTML = loggedInUserDetails.firstName + " " + loggedInUserDetails.lastName + '<img src="images/icon-info.png" class="img-info">';
                        }

                        if (contractMode != 'markup') {
                            getContractTeamAndUserList();
                        }
                        setupSocket();
                        if (redirection) {
                            switchClass(elements.btnMarkupMode, displayNoneClass, true);
                            switchClass(elements.btnMarkupMode.parentElement, 'justify-content-end', true);
                            switchClass(elements.sectionContractLists, displayNoneClass, false);
                            if (contractInformation.counterPartyInviteStatus !== 'Accepted') {
                                clauseNextPage = 1;
                                clauseHasNextPage = true;
                                clauseLists = [];
                                getClauses();
                            }
                        }
                        if (contractInformation.counterPartyInviteStatus == 'Accepted') {
                            switchClass(elements.divInviteCounterparty, displayNoneClass, true);
                            if (redirection == true) {
                                switchClass(elements.divInviteCounterpartyInvited, displayNoneClass, true);
                                switchClass(elements.divInviteCounterparty, displayNoneClass, true);
                                switchClass(elements.paragraphInvitationActions, displayNoneClass, true);
                                switchClass(elements.sectionContractLists, displayNoneClass, false);
                                switchClass(elements.divContractCounterpartySection, disabledClass, false);
                                switchClass(elements.divContractListItems, 'displayed-invitecp-pending', false);
                                switchClass(elements.divContractListItems, 'displayed-invitecp', false);
                            }
                            // set logged-in user profile picture
                            $('.counterparty-user-profile').each(function () {
                                $(this).attr('src', (counterPartyDetail.imageKey ? IMAGE_USER_PATH_LINK + counterPartyDetail.imageKey : 'images/no-profile-image.jpg'));
                            });
                            $('.counterparty-user-profile-name').text(counterPartyDetail.firstName + " " + counterPartyDetail.lastName);
                            $('.counterparty-user-profile-role').text(responseData.oppositeUserRole);
                            elements.counterpartyUserProfileName.innerHTML += '<img src="images/icon-info.png" class="img-info">';
                            elements.txtOrganizationName.textContent = counterPartyCompanyDetail.companyName;
                            switchClass(elements.btnMarkupMode, displayNoneClass, false);
                            switchClass(elements.btnMarkupMode.parentElement, 'justify-content-end', false);
                            if (redirection) {
                                clauseNextPage = 1;
                                clauseHasNextPage = true;
                                clauseLists = [];
                                getClauses();
                            }
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
                            // TODO: Get list of clause logic pending and button show/hide pending - Remove Later
                            /*if (redirection) {
                                switchClass(elements.btnMarkupMode, displayNoneClass, true);
                                switchClass(elements.btnMarkupMode.parentElement, 'justify-content-end', true);
                                /!*switchClass(elements.sectionContractLists, displayNoneClass, false);
                                // if (documentMode != 'markup') {
                                //     getContractTeamAndUserList();
                                // }
                                // clauseNextPage = 1;
                                // clauseHasNextPage = true;
                                // clauseLists = [];
                                // getClauses();
                            }*/
                            switchClass(elements.btnGoToCounterpartyChat, displayNoneClass, true);
                            switchClass(elements.btnGoToCounterparty, displayNoneClass, true);
                            switchClass(elements.chatFooterInnerSameSide, 'justify-content-end', true);
                        } else if (contractInformation.counterPartyInviteStatus == 'Pending') {
                            switchClass(elements.divInviteCounterparty, displayNoneClass, false);
                            switchClass(elements.divContractListItems, displayedInviteCP, true);
                            switchClass(elements.divContractListItems, displayedInvitecpPending, false);
                            if (!(responseData.userRole == 'Admin' || responseData.userRole == 'Contract Creator')) {
                                switchClass(elements.btnInviteCounterparty, disabledClass, true);
                            }
                            // TODO: Counterparty button show/hide and other logic's needed here - Remove later
                            /*document.getElementById('btnGoToCounterpartyChat').classList.add(displayNoneClass);
                            document.getElementById('btnGoToCounterparty').classList.add(displayNoneClass);
                            switchClass(elements.chatFooterInnerSameSide, 'justify-content-end', true);
                            if (documentMode != 'markup') {
                                getContractTeamAndUserList();
                            }
                            if (redirection) {
                                switchClass(elements.btnMarkupMode, displayNoneClass, true);
                                switchClass(elements.btnMarkupMode.parentElement, 'justify-content-end', true);
                                /!*switchClass(elements.sectionContractLists, displayNoneClass, false);
                                if (documentMode != 'markup') {
                                    getContractTeamAndUserList();
                                }
                                clauseNextPage = 1;
                                clauseHasNextPage = true;
                                clauseLists = [];
                                getClauses();*!/
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
    async function inviteCounterparties() {
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
     * @description This function will be used for resend the invitation to join this contract as counterparty
     */
    async function resendInvitation() {
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
                    console.log('Error #14031500:', error);
                    switchClass(elements.loader, displayNoneClass, true);
                });
        } catch (error) {
            console.log('Error #14031440:', error);
        }
    }

    /**
     * @description This function will used for cancelled the sent invitation
     */
    async function cancelInvitation() {
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
                    console.log('Error #14031505:', error);
                    switchClass(elements.loader, displayNoneClass, true);
                });
        } catch (error) {
            console.log('Error #14031506:', error);
        }
    }

    /**
     * @description This function will used for get team and user list of this contract
     * @param popup
     */
    async function getContractTeamAndUserList(popup = 'inviteuser') {
        try {
            var requestURL = apiBaseUrl + '/meeting/get-contract-team-and-user-list/' + contractID;
            var headers = {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + authToken
            };
            var requestOptions = {
                method: 'GET',
                headers: headers,
            };
            fetch(requestURL, {headers: headers})
                .then(response => response.json())
                .then(response => {
                    // Handle the response data
                    if (response && response.status == true && response.code == 200) {
                        var responseData = response.data;
                        if (popup == 'inviteuser') {
                            var contractCreatorUserFilter = responseData.filter((ele) => ele.type == "user" && ele.role == "Contract Creator");
                            if (contractCreatorUserFilter && contractCreatorUserFilter.length > 0) {
                                contractCreatorDetails = contractCreatorUserFilter[0];
                            }
                            var contractCounterpartyFilter = responseData.filter((ele) => ele.type == "user" && ele.role == "Counterparty");
                            if (contractCounterpartyFilter && contractCounterpartyFilter.length > 0) {
                                contractCounterPartyDetails = contractCounterpartyFilter[0];
                            }
                            var teamLists = responseData.filter((ele) => {
                                return ele.type == "team";
                            });
                            var userLists = responseData.filter((ele) => {
                                return ele.type == "user" && (ele.role !== "Contract Creator" && ele.role !== "Admin" && ele.role !== "Counterparty");
                            });
                            if (teamLists.length > 0) {
                                inviteTeamListIDs = teamLists;
                                if (elements.paragraphTeamsNotFoundMessage) {
                                    switchClass(elements.paragraphTeamsNotFoundMessage, displayNoneClass, true);
                                }
                                if (elements.chkboxInviteAllTeams) {
                                    switchClass(elements.chkboxInviteAllTeams, displayNoneClass, false);
                                }
                                var html = '';
                                html += '<div class="filter-inner">\n';
                                html += '<ul>\n';
                                teamLists.forEach((ele) => {
                                    html += '<li>\n' +
                                        '<div class="form-check" data-id="' + ele.itemId + '" data-json="' + JSON.stringify(ele) + '">\n' +
                                        '<input type="checkbox" id="chkboxInviteTeam_' + ele.itemId + '" class="form-check-input team-chkbox" />' +
                                        '<label for="chkboxInviteTeam_' + ele.itemId + '" class="form-check-label">\n' +
                                        '<div class="invite-users-inner-bar">\n' +
                                        '<div class="invite-users-name">\n' +
                                        '<strong>' + ele.itemName + '</strong>\n' +
                                        '</div>\n' +
                                        '</div>\n' +
                                        '</label>\n' +
                                        '</div>\n' +
                                        '</li>\n';
                                });
                                html += '</ul>\n';
                                html += '</div>';
                                elements.accordionBodyTeams.innerHTML = html;
                            }
                            if (userLists.length > 0) {
                                inviteUserListIDs = userLists;
                                if (elements.paragraphUsersNotFoundMessage) {
                                    switchClass(elements.paragraphUsersNotFoundMessage, displayNoneClass, true);
                                }
                                if (elements.chkboxInviteAllUsers) {
                                    switchClass(elements.chkboxInviteAllUsers, displayNoneClass, false);
                                }
                                var html = '';
                                html += '<div class="filter-inner">';
                                html += '<ul>';
                                // ' + IMAGE_USER_PATH_LINK + ele.userImage + '
                                // assets/images/no-profile-image.jpg
                                userLists.forEach((ele) => {
                                    html += '<li>';
                                    html += '<div class="form-check" data-id="' + ele.itemId + '" data-json="' + JSON.stringify(ele) + '">\n' +
                                        '\t<input type="checkbox" id="chkboxInviteUser_' + ele.itemId + '" class="form-check-input user-chkbox" value="' + ele.itemId + '">\n' +
                                        '\t<label for="chkboxInviteUser_' + ele.itemId + '" class="form-check-label">\n' +
                                        '\t\t<div class="conversation-left">\n' +
                                        '\t\t\t<span class="user-icon" id="userProfileImage">\n' +
                                        '\t\t\t\t<img src="' + (ele.userImage ? IMAGE_USER_PATH_LINK + ele.userImage : 'images/no-profile-image.jpg') + '" alt="">\n' +
                                        '\t\t\t</span>\n' +
                                        '\t\t\t<div class="user-inner">\n' +
                                        '\t\t\t\t<span class="user-name" id="userProfileNameSpan">' + ele.itemName + '</span>\n' +
                                        '\t\t\t\t<p id="userProfileroleSpan">' + ele.role + '</p>\n' +
                                        '\t\t\t</div>\n' +
                                        '\t\t</div>\n' +
                                        '\t</label>\n' +
                                        '</div>';
                                    html += '</li>';
                                });
                                html += '</ul>';
                                html += '</div>';
                                elements.accordionBodyUsers.innerHTML = html;
                            }
                        } else if (popup == 'positionConfirmation') {
                            var userLists = responseData.filter((ele) => {
                                return ele.type == "user" && ele.canDraftContract;
                            });
                            if (userLists.length > 0) {
                                inviteUserListIDs = userLists;
                                var usersNoteFoundMessage = document.getElementById('usersNoteFoundMessageB');
                                if (usersNoteFoundMessage) {
                                    usersNoteFoundMessage.classList.add(displayNoneClass);
                                }
                                var html = '';
                                html += '<div class="filter-inner">';
                                html += '<ul>';
                                // ' + IMAGE_USER_PATH_LINK + ele.userImage + '
                                // assets/images/no-profile-image.jpg
                                userLists.forEach((ele) => {
                                    html += '<li>';
                                    html += '<div class="assign-draft-request-user" data-id="' + ele.itemId + '" data-name="' + ele.itemName + '" data-json="' + JSON.stringify(ele) + '">\n' +
                                        '\t<label for="inviteuser" class="form-check-label">\n' +
                                        '\t\t<div class="conversation-left">\n' +
                                        '\t\t\t<span class="user-icon" id="userProfileImage">\n' +
                                        '\t\t\t\t<img src="' + (ele.userImage ? IMAGE_USER_PATH_LINK + ele.userImage : 'images/no-profile-image.jpg') + '" alt="">\n' +
                                        '\t\t\t</span>\n' +
                                        '\t\t\t<div class="user-inner">\n' +
                                        '\t\t\t\t<span class="user-name" id="userProfileNameSpan">' + ele.itemName + '</span>\n' +
                                        '\t\t\t\t<p id="userProfileroleSpan">' + ele.role + '</p>\n' +
                                        '\t\t\t</div>\n' +
                                        '\t\t</div>\n' +
                                        '\t</label>\n' +
                                        '</div>';
                                    html += '</li>';
                                });
                                html += '</ul>';
                                html += '</div>';
                                elements.accordionPositionConfirmation.innerHTML = html;
                            }
                        } else if (popup == 'assignDraftRequest') {
                            var userLists = responseData.filter((ele) => {
                                return ele.type == "user" && ele.canDraftContract && (ele.role == "Contract Creator" || ele.role == "Admin" || ele.role == "Counterparty" || ele.role == "Position Confirmer");
                            });
                            if (userLists.length > 0) {
                                inviteUserListIDs = userLists;
                                var usersNoteFoundMessage = document.getElementById('usersNoteFoundMessageA');
                                if (usersNoteFoundMessage) {
                                    usersNoteFoundMessage.classList.add(displayNoneClass);
                                }
                                var renderHTML = '';
                                renderHTML += '<div class="filter-inner">';
                                renderHTML += '<ul>';
                                // ' + IMAGE_USER_PATH_LINK + ele.userImage + '
                                // assets/images/no-profile-image.jpg
                                userLists.forEach((ele) => {
                                    renderHTML += '<li>';
                                    renderHTML += '<div class="draft-request-user" data-id="' + ele.itemId + '" data-name="' + ele.itemName + '" data-json="' + JSON.stringify(ele) + '">\n' +
                                        '\t<label for="inviteuser_' + ele.itemId + '" class="form-check-label">\n' +
                                        '\t\t<div class="conversation-left">\n' +
                                        '\t\t\t<span class="user-icon" id="userProfileImage">\n' +
                                        '\t\t\t\t<img src="' + (ele.userImage ? IMAGE_USER_PATH_LINK + ele.userImage : 'images/no-profile-image.jpg') + '" alt="">\n' +
                                        '\t\t\t</span>\n' +
                                        '\t\t\t<div class="user-inner">\n' +
                                        '\t\t\t\t<span class="user-name" id="userProfileNameSpan">' + ele.itemName + '</span>\n' +
                                        '\t\t\t\t<p id="userProfileroleSpan">' + ele.role + '</p>\n' +
                                        '\t\t\t</div>\n' +
                                        '\t\t</div>\n' +
                                        '\t</label>\n' +
                                        '</div>';
                                    renderHTML += '</li>';
                                });
                                renderHTML += '</ul>';
                                renderHTML += '</div>';
                                elements.accordionAssignDraftRequest.innerHTML = renderHTML;
                            }
                        }
                    }
                    switchClass(elements.loader, displayNoneClass, true);
                })
                .catch(error => {
                    // Handle any errors
                    console.log('Error #14031510:', error);
                    switchClass(elements.loader, displayNoneClass, true);
                });
        } catch (error) {
            console.log('Error #14031511:', error);
        }
    }

    /**
     * @description This function will used for create clause section on contract
     * @param socket
     */
    async function createClauseSection(socket) {
        try {
            switchClass(elements.loader, displayNoneClass, false);
            var randomNumber = Math.floor(Math.random() * (1000000 - 1 + 1)) + 1;
            var commentID = Date.now() + '-' + randomNumber;
            var form = elements.formClause;
            var data = JSON.stringify({
                contractId: contractID,
                contractSection: form.elements['contractSection'].value,
                contractSectionDescription: form.elements['contractDescription'].value,
                assignedTeamAndUserDetails: [...selectedInviteTeams, ...selectedInviteUsers],
                commentId: commentID
            });
            var requestURL = apiBaseUrl + '/contract-section/create-contract-section';
            var headers = {
                "Content-Type": "application/json"
            };
            if (authToken) headers["Authorization"] = 'Bearer ' + authToken;
            var requestOptions = {
                method: 'POST',
                headers: headers,
                body: data
            };
            fetch(requestURL, requestOptions)
                .then(response => response.json())
                .then(response => {
                    // Handle the response data
                    var responseData = response;
                    if (responseData && responseData.status == true && responseData.code == 201) {
                        // debugger;
                        // Handle the response data
                        // redirectToClauseList();
                        if (typeof window.Asc.plugin.executeMethod === 'function') {
                            var sDocumentEditingRestrictions = "none";
                            window.Asc.plugin.executeMethod("SetEditingRestrictions", [sDocumentEditingRestrictions]);
                        }
                        var nContentControlType = 1;
                        var color = {
                            R: 104,
                            G: 215,
                            B: 248,
                        };
                        var nContentControlProperties = {
                            "Id": randomNumber,
                            "Tag": commentID,
                            "Lock": 2,
                            "Color": color,
                            "InternalId": randomNumber.toString()
                        };
                        tagLists.push(nContentControlProperties);
                        if (typeof window.Asc.plugin.executeMethod === 'function') {
                            window.Asc.plugin.executeMethod("AddContentControl", [nContentControlType, nContentControlProperties]);
                            window.Asc.plugin.executeMethod("GetAllContentControls");
                        }

                        if (contractInformation && contractInformation.userWhoHasEditAccess && contractInformation.userWhoHasEditAccess == loggedInUserDetails._id && openContractResponseData.contractCurrentState == 'Edit') {
                            if (typeof window.Asc.plugin.executeMethod === 'function') {
                                var sDocumentEditingRestrictions = "none";
                                window.Asc.plugin.executeMethod("SetEditingRestrictions", [sDocumentEditingRestrictions]);
                            }
                        } else {
                            if (typeof window.Asc.plugin.executeMethod === 'function') {
                                var sDocumentEditingRestrictions = "readOnly";
                                window.Asc.plugin.executeMethod("SetEditingRestrictions", [sDocumentEditingRestrictions]);
                            }
                        }
                        // TODO: Pending clause lists
                        clauseNextPage = 1;
                        clauseHasNextPage = true;
                        clauseLists = [];
                        getClauses(commentID);
                        var data = {
                            chatRoomName: contractID,
                            tagData: JSON.stringify(nContentControlProperties)
                        };
                        socket.emit('newClauseCreated', data);
                        // location.reload(true);
                        switchClass(elements.sectionConversionHistory, displayNoneClass, true);
                        switchClass(elements.sectionCreateClause, displayNoneClass, true);
                        switchClass(elements.sectionContractLists, displayNoneClass, false);
                        switchClass(elements.loader, displayNoneClass, true);
                    } else {
                        switchClass(elements.loader, displayNoneClass, true);
                    }
                    switchClass(elements.loader, displayNoneClass, true);
                })
                .catch(error => {
                    // Handle any errors
                    console.log('Error #14031515:', error);
                    switchClass(elements.loader, displayNoneClass, true);
                });
        } catch (error) {
            console.log('Error #14031516:', error);
        }
    }

    /**
     * @description This function will used for the get all clause section on open contract
     * @param commentThreadID
     */
    async function getClauses(commentThreadID = null) {
        try {
            switchClass(elements.loader, displayNoneClass, false);
            var requestURL = apiBaseUrl + '/contract-section/get-contract-sections/' + contractID;
            requestURL += '?';
            var headers = {
                "Content-Type": "application/json"
            };
            if (authToken) headers["Authorization"] = 'Bearer ' + authToken;
            var queryParam = [];
            // Search text
            if (searchText) {
                queryParam.push('filter[search_text]=' + searchText);
            }
            queryParam.push('contractSectionStatus=all');
            // Set sortby created time
            queryParam.push('sort[createdAt]=-1');
            // Set pageSize
            queryParam.push('page=' + clauseNextPage);
            // Set recordLimit
            queryParam.push('limit=' + 10);
            // Set queryparams
            requestURL += queryParam.join('&');

            fetch(requestURL, {headers: headers})
                .then(response => response.json())
                .then(response => {
                    // Handle the response data
                    if (response && response.status == true && response.code == 200) {
                        var responseData = response.data;
                        if (clauseNextPage == 1) {
                            document.getElementById('divContractListItems').innerHTML = '';
                        }
                        if (responseData.data.length > 0) {
                            var result = responseData.data;
                            var html = '';
                            result.forEach((ele) => {
                                clauseLists.push(ele);
                                var commentID = ele.commentId;
                                // TODO: API Logic Pending for "unreadMessageSide"
                                html += '<div class="contract-item" data-id="' + ele._id + '" data-commentid="' + commentID + '" data-chatwindow="' + (ele.unreadMessageSide ? ele.unreadMessageSide : '-') + '" id="' + commentID.split('-').pop() + '">\n' +
                                    '\t\t\t<a href="#">\n';
                                html += '\t\t\t\t\t\t<span class="notification-no ' + (ele.hasUnreadMessage ? '' : displayNoneClass) + '"></span>';
                                html += '\t\t\t\t\t\t<div class="contract-top">\n' +
                                    '\t\t\t\t\t\t\t\t\t<h3>' + ele.contractSection + '</h3>\n' +
                                    '\t\t\t\t\t\t\t\t\t<p>' + ele.contractSectionDescription + '</p>\n';
                                var contractStatusColorCode = 'active-color';
                                if (ele.contractSectionStatus == 'Drafting') {
                                    contractStatusColorCode = 'fuchsia-color';
                                } else if (ele.contractSectionStatus == 'Under Negotiation') {
                                    contractStatusColorCode = 'blue-color';
                                } else if (ele.contractSectionStatus == 'Agreed Position') {
                                    contractStatusColorCode = 'dark-green-color';
                                } else if (ele.contractSectionStatus == 'Under Revision') {
                                    contractStatusColorCode = 'brown-color';
                                } else if (ele.contractSectionStatus == 'Requires Discussion') {
                                    contractStatusColorCode = 'invited-color';
                                } else if (ele.contractSectionStatus == 'Completed') {
                                    contractStatusColorCode = 'success-color';
                                } else if (ele.contractSectionStatus == 'Withdrawn') {
                                    contractStatusColorCode = 'withdrawn-color';
                                }
                                html += '\t\t\t\t\t\t\t\t\t<button class="btn ' + contractStatusColorCode + '">' + ele.contractSectionStatus + '</button>\n';

                                html += '\t\t\t\t\t\t</div>\n' +
                                    '\t\t\t\t\t\t<div class="contract-foot">\n' +
                                    '\t\t\t\t\t\t\t\t\t<div class="contract-foot-inner">\n' +
                                    '\t\t\t\t\t\t\t\t\t\t\t\t<div class="contract-foot-item">\n' +
                                    '\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<h3>Created by</h3>\n' +
                                    '\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div class="contract-user">\n';

                                html += '\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div class="approved-user-lists"><img src="' + (ele && ele.createdByUserDetails && ele.createdByUserDetails.imageKey ? IMAGE_USER_PATH_LINK + ele.createdByUserDetails.imageKey : 'images/no-profile-image.jpg') + '" alt="">\n' +
                                    '\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<span>' + (ele && ele.createdByUserDetails ? ele.createdByUserDetails.firstName + ' ' + ele.createdByUserDetails.lastName : '') + '</span></div>\n';

                                html += '\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</div>\n' +
                                    '\t\t\t\t\t\t\t\t\t\t\t\t</div>\n' +
                                    '\t\t\t\t\t\t\t\t\t\t\t\t<div class="contract-foot-item">\n' +
                                    '\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<h3>Requires action by</h3>\n' +
                                    '\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div class="contract-user">\n';

                                if (ele && ele.actionRequiredByUsers && ele.actionRequiredByUsers.length > 0) {
                                    ele.actionRequiredByUsers.forEach((element) => {
                                        html += '\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div class="approved-user-lists"><img src="' + (element && ele?.imageKey ? IMAGE_USER_PATH_LINK + ele?.imageKey : 'images/no-profile-image.jpg') + '" alt="">\n' +
                                            '\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<span>' + (element ? element.firstName + ' ' + element.lastName : '') + '</span></div>\n';
                                    });
                                } else {
                                    html += '\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<span>&mdash;</span>\n';
                                }

                                html += '\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</div>\n' +
                                    '\t\t\t\t\t\t\t\t\t\t\t\t</div>\n' +
                                    '\t\t\t\t\t\t\t\t\t</div>\n' +
                                    '\t\t\t\t\t\t</div>\n' +
                                    '\t\t\t</a>\n' +
                                    '</div>';
                            });
                            if (clauseLists && clauseLists.length > 2) {
                                switchClass(elements.btnScrollDown, displayNoneClass, false);
                            } else {
                                switchClass(elements.btnScrollDown, displayNoneClass, true);
                            }
                            if (clauseNextPage == 1) {
                                document.getElementById('divContractListItems').innerHTML += html;
                            } else {
                                var newElement = document.createElement("div");
                                newElement.innerHTML = html;
                                document.getElementById('divContractListItems').insertAdjacentElement("beforeend", newElement);
                            }
                            clauseHasNextPage = responseData.hasNextPage;
                            clauseNextPage = responseData.nextPage;
                            if (!flagRedirectFirst && sectionID && sectionID != "0") {
                                setTimeout(function () {
                                    flagRedirectClauseCreate = true;
                                    $('.contract-item[data-id="' + sectionID + '"]').click();
                                    switchClass(elements.sectionContractLists, displayNoneClass, true);
                                    if (chatWindows == 'SS') {
                                        $('#btnGoToSameSideChat').click();
                                    } else if (chatWindows == 'CP') {
                                        $('#btnGoToCounterpartyChat').click();
                                    }
                                    flagRedirectFirst = true;
                                }, 500);
                            } else if (commentThreadID) {
                                // debugger;
                                setTimeout(function () {
                                    flagRedirectClauseCreate = true;
                                    $('.contract-item[data-commentid="' + commentThreadID + '"]').click();
                                    $('#btnGoToSameSideChat').click();
                                    if (!openContractResponseData.canCommunicateWithCounterparty) {
                                        switchClass(elements.btnGoToCounterpartyChat, displayNoneClass, true);
                                        switchClass(elements.btnGoToCounterparty, displayNoneClass, true);
                                        switchClass(elements.chatFooterInnerSameSide, 'justify-content-end', true);
                                    }
                                    if (contractInformation.counterPartyInviteStatus != 'Accepted') {
                                        switchClass(elements.btnGoToCounterpartyChat, displayNoneClass, true);
                                        switchClass(elements.btnGoToCounterparty, displayNoneClass, true);
                                        switchClass(elements.chatFooterInnerSameSide, 'justify-content-end', true);
                                    }
                                }, 500);
                            }
                        } else {
                            var norecordhtml = '<p class="nodata-info">No clauses available</p>';
                            document.getElementById('divContractListItems').innerHTML = norecordhtml;
                            switchClass(elements.btnScrollDown, displayNoneClass, true);
                        }
                    }
                    switchClass(elements.loader, displayNoneClass, true);
                })
                .catch(error => {
                    // Handle any errors
                    console.log('Error #19031259:', error);
                    switchClass(elements.loader, displayNoneClass, true);
                });
        } catch (error) {
            console.log('Error #19031300:', error);
        }
    }

    /**
     * @description This function will used the get the clause information
     */
    async function getContractSectionDetails() {
        try {
            let requestURL = apiBaseUrl + '/contract-section/get-contract-section-details/' + selectedClauseID;
            var headers = {
                "Content-Type": "application/json"
            };
            if (authToken) headers["Authorization"] = 'Bearer ' + authToken;
            return fetch(requestURL, {headers: headers})
                .then(response => response.json())
                .then(response => {
                    // Handle the response data
                    elements.divInvitedUsers.innerHTML = '';
                    elements.divInvitedTeams.innerHTML = '';
                    if (response && response.status == true && response.code == 200) {
                        var responseData = response.data;
                        switchClass(elements.divSameSideTextbox, displayNoneClass, false);
                        switchClass(elements.divCounterpartyTextbox, displayNoneClass, false);
                        selectedContractSectionDetails = responseData;
                        if (responseData.sameSideUserList && responseData.sameSideUserList.length > 0) {
                            sameSideUserList = [];
                            responseData.sameSideUserList.forEach(function (element) {
                                if (element.userId != loggedInUserDetails._id) {
                                    sameSideUserList.push({
                                        'id': element.userId,
                                        'name': element.userName,
                                        'companyId': element.companyId
                                    })
                                }
                            });
                        }
                        if (responseData.getContractSectionUserList && responseData.getContractSectionUserList.length > 0) {
                            counterpartyUserList = [];
                            responseData.getContractSectionUserList.forEach(function (element) {
                                if (element.userId != loggedInUserDetails._id) {
                                    counterpartyUserList.push({
                                        'id': element.userId,
                                        'name': element.userName,
                                        'companyId': element.companyId
                                    })
                                }
                            });
                        }
                        setSameSideUserTagLists();
                        setCounterPartyUserTagLists();

                        switchClass(elements.divSameSideTextbox, displayNoneClass, false);
                        switchClass(elements.divCounterpartyTextbox, displayNoneClass, false);

                        var draftConfirmCPElement = document.getElementById("draftConfirmCP");
                        if (draftConfirmCPElement) {
                            draftConfirmCPElement.parentNode.removeChild(draftConfirmCPElement);
                        }
                        var draftConfirmSSElement = document.getElementById("draftConfirmSS");
                        if (draftConfirmSSElement) {
                            draftConfirmSSElement.parentNode.removeChild(draftConfirmSSElement);
                        }

                        switchClass(elements.divChatSameSideBody, 'contract-completed', false);
                        switchClass(elements.divChatCounterPartyBody, 'contract-completed', false);

                        var iHtml = '<ul>';
                        if (contractCreatorDetails) {
                            iHtml += '<li>\n' +
                                '\t\t\t\t<div class="invite-user-inner">\n' +
                                '\t\t\t\t\t\t\t\t<div class="invite-user-icon">\n' +
                                '\t\t\t\t\t\t\t\t\t\t\t\t<img src="' + (contractCreatorDetails.userImage ? IMAGE_USER_PATH_LINK + contractCreatorDetails.userImage : 'images/no-profile-image.jpg') + '" alt="">\n' +
                                '\t\t\t\t\t\t\t\t</div>\n' +
                                '\t\t\t\t\t\t\t\t<div class="invite-user-name">\n' +
                                '\t\t\t\t\t\t\t\t\t\t\t\t<h3>' + contractCreatorDetails.itemName + '</h3>\n' +
                                '\t\t\t\t\t\t\t\t\t\t\t\t<span>' + contractCreatorDetails.role + '</span>\n' +
                                '\t\t\t\t\t\t\t\t</div>\n' +
                                '\t\t\t\t</div>\n' +
                                '</li>';
                        }
                        if (contractCounterPartyDetails) {
                            iHtml += '<li>\n' +
                                '\t\t\t\t<div class="invite-user-inner">\n' +
                                '\t\t\t\t\t\t\t\t<div class="invite-user-icon">\n' +
                                '\t\t\t\t\t\t\t\t\t\t\t\t<img src="' + (contractCounterPartyDetails.userImage ? IMAGE_USER_PATH_LINK + contractCounterPartyDetails.userImage : 'images/no-profile-image.jpg') + '" alt="">\n' +
                                '\t\t\t\t\t\t\t\t</div>\n' +
                                '\t\t\t\t\t\t\t\t<div class="invite-user-name">\n' +
                                '\t\t\t\t\t\t\t\t\t\t\t\t<h3>' + contractCounterPartyDetails.itemName + '</h3>\n' +
                                '\t\t\t\t\t\t\t\t\t\t\t\t<span>' + contractCounterPartyDetails.role + '</span>\n' +
                                '\t\t\t\t\t\t\t\t</div>\n' +
                                '\t\t\t\t</div>\n' +
                                '</li>';
                        }
                        if (selectedContractSectionDetails.contractAssignedUsers && selectedContractSectionDetails.contractAssignedUsers.length > 0) {
                            if (openContractResponseData.canSendPositionConfirmation == true) {
                                switchClass(elements.btnSendPositionConfirmationSameSide.closest("li"), displayNoneClass, false);
                            }
                            selectedContractSectionDetails.contractAssignedUsers.forEach((ele) => {
                                iHtml += '<li>\n' +
                                    '\t\t\t\t<div class="invite-user-inner">\n' +
                                    '\t\t\t\t\t\t\t\t<div class="invite-user-icon">\n' +
                                    '\t\t\t\t\t\t\t\t\t\t\t\t<img src="' + (ele.userId && ele.userId.userImage ? IMAGE_USER_PATH_LINK + ele.userId.userImage : 'images/no-profile-image.jpg') + '" alt="">\n' +
                                    '\t\t\t\t\t\t\t\t</div>\n' +
                                    '\t\t\t\t\t\t\t\t<div class="invite-user-name">\n' +
                                    '\t\t\t\t\t\t\t\t\t\t\t\t<h3>' + ele.userId.firstName + ' ' + ele.userId.lastName + '</h3>\n' +
                                    '\t\t\t\t\t\t\t\t\t\t\t\t<span>' + ele.userRole + '</span>\n' +
                                    '\t\t\t\t\t\t\t\t</div>\n' +
                                    '\t\t\t\t</div>\n' +
                                    '</li>';
                            });
                        } else {
                            switchClass(elements.btnSendPositionConfirmationSameSide.closest("li"), displayNoneClass, true);
                        }
                        iHtml += '</ul>';
                        elements.divInvitedUsers.innerHTML = iHtml;

                        if (selectedContractSectionDetails.contractAssignedTeams && selectedContractSectionDetails.contractAssignedTeams.length > 0) {
                            var iHtml = '<ul>';
                            selectedContractSectionDetails.contractAssignedTeams.forEach((ele) => {
                                iHtml += '<li>\n' +
                                    '\t\t\t\t<div class="invite-user-inner">\n' +
                                    '\t\t\t\t\t\t\t\t<div class="invite-user-name">\n' +
                                    '\t\t\t\t\t\t\t\t\t\t\t\t<h3>' + ele.teamName + '</h3>\n' +
                                    '\t\t\t\t\t\t\t\t</div>\n' +
                                    '\t\t\t\t</div>\n' +
                                    '</li>';
                            });
                            iHtml += '</ul>';
                            elements.divInvitedTeams.innerHTML = iHtml;
                        } else {
                            var html = '<ul>' +
                                '<li><p>No team selected</p></li>' +
                                '</ul>';
                            elements.divInvitedTeams.innerHTML = html;
                        }
                        if (selectedContractSectionDetails && selectedContractSectionDetails.contractSectionData && selectedContractSectionDetails.contractSectionData.contractSection) {
                            let contractCreatorUsers = [];
                            let opositesideUsers = [];
                            if (selectedContractSectionDetails.contractSectionUsers && selectedContractSectionDetails.contractSectionUsers.length > 0) {
                                selectedContractSectionDetails.contractSectionUsers.forEach((ele) => {
                                    if (ele.companyId == contractInformation.companyId) {
                                        contractCreatorUsers.push(ele);
                                    } else {
                                        opositesideUsers.push(ele);
                                    }
                                });
                            }

                            let contractCreatorUsersHtml = '<ul>';
                            if (selectedContractSectionDetails.contractCreatorDetail) {
                                contractCreatorUsersHtml += '<li>\n' +
                                    '\t\t\t\t<div class="invite-user-inner">\n' +
                                    '\t\t\t\t\t\t\t\t<div class="invite-user-icon">\n' +
                                    '\t\t\t\t\t\t\t\t\t\t\t\t<img src="' + (selectedContractSectionDetails.contractCreatorDetail.imageKey ? IMAGE_USER_PATH_LINK + selectedContractSectionDetails.contractCreatorDetail.imageKey : 'images/no-profile-image.jpg') + '" alt="">\n' +
                                    '\t\t\t\t\t\t\t\t</div>\n' +
                                    '\t\t\t\t\t\t\t\t<div class="invite-user-name">\n' +
                                    '\t\t\t\t\t\t\t\t\t\t\t\t<h3>' + selectedContractSectionDetails.contractCreatorDetail.firstName + ' ' + selectedContractSectionDetails.contractCreatorDetail.lastName + '</h3>\n' +
                                    '\t\t\t\t\t\t\t\t\t\t\t\t<span>Contract Creator</span>\n' +
                                    '\t\t\t\t\t\t\t\t</div>\n' +
                                    '\t\t\t\t</div>\n' +
                                    '</li>';
                            }
                            if (contractCreatorUsers && contractCreatorUsers.length > 0) {
                                contractCreatorUsers.forEach((el) => {
                                    contractCreatorUsersHtml += '<li>\n' +
                                        '\t\t\t\t<div class="invite-user-inner">\n' +
                                        '\t\t\t\t\t\t\t\t<div class="invite-user-icon">\n' +
                                        '\t\t\t\t\t\t\t\t\t\t\t\t<img src="' + (el.userId.imageKey ? IMAGE_USER_PATH_LINK + el.userId.imageKey : 'images/no-profile-image.jpg') + '" alt="">\n' +
                                        '\t\t\t\t\t\t\t\t</div>\n' +
                                        '\t\t\t\t\t\t\t\t<div class="invite-user-name">\n' +
                                        '\t\t\t\t\t\t\t\t\t\t\t\t<h3>' + el.userId.firstName + ' ' + el.userId.lastName + '</h3>\n' +
                                        '\t\t\t\t\t\t\t\t\t\t\t\t<span>' + el.userRole + '</span>\n' +
                                        '\t\t\t\t\t\t\t\t</div>\n' +
                                        '\t\t\t\t</div>\n' +
                                        '</li>';
                                });
                            }
                            contractCreatorUsersHtml += '</ul>';

                            let opositesideUserHtml = '<ul>';
                            if (selectedContractSectionDetails.contractCounterPartyDetail) {
                                opositesideUserHtml += '<li>\n' +
                                    '\t\t\t\t<div class="invite-user-inner">\n' +
                                    '\t\t\t\t\t\t\t\t<div class="invite-user-icon">\n' +
                                    '\t\t\t\t\t\t\t\t\t\t\t\t<img src="' + (selectedContractSectionDetails.contractCounterPartyDetail.imageUrl ? selectedContractSectionDetails.contractCounterPartyDetail.imageUrl : 'images/no-profile-image.jpg') + '" alt="">\n' +
                                    '\t\t\t\t\t\t\t\t</div>\n' +
                                    '\t\t\t\t\t\t\t\t<div class="invite-user-name">\n' +
                                    '\t\t\t\t\t\t\t\t\t\t\t\t<h3>' + selectedContractSectionDetails.contractCounterPartyDetail.firstName + ' ' + selectedContractSectionDetails.contractCounterPartyDetail.lastName + '</h3>\n' +
                                    '\t\t\t\t\t\t\t\t\t\t\t\t<span>Counterparty</span>\n' +
                                    '\t\t\t\t\t\t\t\t</div>\n' +
                                    '\t\t\t\t</div>\n' +
                                    '</li>';
                            }
                            if (opositesideUsers && opositesideUsers.length > 0) {
                                opositesideUsers.forEach((el) => {
                                    opositesideUserHtml += '<li>\n' +
                                        '\t\t\t\t<div class="invite-user-inner">\n' +
                                        '\t\t\t\t\t\t\t\t<div class="invite-user-icon">\n' +
                                        '\t\t\t\t\t\t\t\t\t\t\t\t<img src="' + (el.userId.imageUrl ? el.userId.imageUrl : 'images/no-profile-image.jpg') + '" alt="">\n' +
                                        '\t\t\t\t\t\t\t\t</div>\n' +
                                        '\t\t\t\t\t\t\t\t<div class="invite-user-name">\n' +
                                        '\t\t\t\t\t\t\t\t\t\t\t\t<h3>' + el.userId.firstName + ' ' + el.userId.lastName + '</h3>\n' +
                                        '\t\t\t\t\t\t\t\t\t\t\t\t<span>' + el.userRole + '</span>\n' +
                                        '\t\t\t\t\t\t\t\t</div>\n' +
                                        '\t\t\t\t</div>\n' +
                                        '</li>';
                                });
                            }
                            opositesideUserHtml += '</ul>';


                            // Get the tooltip button
                            var tooltipButtonA = document.getElementById('divUserProfileA');

                            // Set the dynamic HTML content for the tooltip
                            var dynamicHTMLContentA = '<div class=" active" id="inviteUserTabs">\n' +
                                '                                <div class="clause-heading">\n' +
                                '                                    <h3>' + selectedContractSectionDetails.contractSectionData.contractSection + '</h3>\n' +
                                '                                </div>\n' +
                                '                                <div class="invite-user-tabs-body">\n' +
                                '                                    <div class="invite-user-tabs">\n' +
                                '                                        <div id="usersTabsA" class="tab-pane active" role="tabpanel">\n' +
                                '                                            <div class="invite-user-list">\n' +
                                '                                                <div id="userTabContent">' + (loggedInCompanyDetails._id == contractInformation.companyId ? contractCreatorUsersHtml : opositesideUserHtml) + '</div>\n' +
                                '                                            </div>\n' +
                                '                                        </div>\n' +
                                '                                    </div>\n' +
                                '                                </div>\n' +
                                '                            </div>';

                            // Initialize the tooltip manually with a custom class
                            var tooltipA = new bootstrap.Tooltip(tooltipButtonA, {
                                title: dynamicHTMLContentA,
                                html: true,
                                placement: 'bottom',
                                customClass: 'custom-tooltip-class' // Add your custom class here
                            });

                            // Show the tooltip on mouseover
                            tooltipButtonA.addEventListener('mouseover', function () {
                                tooltipA.show();
                            });

                            // Hide the tooltip on mouseleave
                            tooltipButtonA.addEventListener('mouseleave', function () {
                                tooltipA.hide();
                            });

                            // Get the tooltip button
                            var tooltipButtonB = document.getElementById('divOppsiteUserProfile');

                            // Set the dynamic HTML content for the tooltip
                            var dynamicHTMLContentB = '<div id="inviteUserTabsA">\n' +
                                '                                <div class="clause-heading">\n' +
                                '                                    <h3>' + selectedContractSectionDetails.contractSectionData.contractSection + '</h3>\n' +
                                '                                </div>\n' +
                                '                                <div class="invite-user-tabs-body">\n' +
                                '                                    <div class="invite-user-tabs">\n' +
                                '                                        <div id="usersTabsA" class="tab-pane active" role="tabpanel">\n' +
                                '                                            <div class="invite-user-list">\n' +
                                '                                                <div id="userTabContent">' + (loggedInCompanyDetails._id != contractInformation.companyId ? contractCreatorUsersHtml : opositesideUserHtml) + '</div>\n' +
                                '                                            </div>\n' +
                                '                                        </div>\n' +
                                '                                    </div>\n' +
                                '                                </div>\n' +
                                '                      </div>';

                            // Initialize the tooltip manually with a custom class
                            var tooltipB = new bootstrap.Tooltip(tooltipButtonB, {
                                title: dynamicHTMLContentB,
                                html: true,
                                placement: 'bottom',
                                customClass: 'custom-tooltip-class counterparty-tooltip' // Add your custom class here
                            });

                            // Show the tooltip on mouseover
                            tooltipButtonB.addEventListener('mouseover', function () {
                                tooltipB.show();
                            });

                            // Hide the tooltip on mouseleave
                            tooltipButtonB.addEventListener('mouseleave', function () {
                                tooltipB.hide();
                            });
                        }
                        if (selectedContractSectionDetails && selectedContractSectionDetails.contractSectionData && (selectedContractSectionDetails.contractSectionData.contractSectionStatus == "Completed" || selectedContractSectionDetails.contractSectionData.contractSectionStatus == "Withdrawn")) {
                            switchClass(elements.divSameSideTextbox, displayNoneClass, true);
                            switchClass(elements.divCounterpartyTextbox, displayNoneClass, true);

                            var actionSameSide = document.querySelectorAll('.action-sameside');
                            actionSameSide.forEach(function (element) {
                                element.classList.add(displayNoneClass);
                            });
                            var actionCounterparty = document.querySelectorAll('.action-counterparty');
                            actionCounterparty.forEach(function (element) {
                                element.classList.add(displayNoneClass);
                            });

                            var renderHTML = '';
                            var message = '';
                            if (selectedContractSectionDetails.contractSectionData.contractSectionStatus == "Completed") {
                                message = selectedContractSectionDetails.contractSectionData.draftConfirmMessage + " " + selectedContractSectionDetails.contractSectionData.confirmByCounterPartyId.firstName + " " + selectedContractSectionDetails.contractSectionData.confirmByCounterPartyId.lastName + " and " + selectedContractSectionDetails.contractSectionData.confirmByUserId.firstName + " " + selectedContractSectionDetails.contractSectionData.confirmByUserId.lastName;
                            } else {
                                message = 'This contract section has been withdrawn by ' + selectedContractSectionDetails.contractSectionData.contractSectionWithdrawnBy.firstName + " " + selectedContractSectionDetails.contractSectionData.contractSectionWithdrawnBy.lastName;
                            }
                            renderHTML += '<div class="chat-typing-area" id="draftConfirmCP">\n' +
                                '   <div class="position-text">' + message + '</div>\n';
                            if (openContractResponseData.userRole == "Admin" || openContractResponseData.userRole == "Contract Creator" || openContractResponseData.userRole == "Counterparty" || openContractResponseData.userRole == "Position Confirmer") {
                                renderHTML += '   <div class="btn-box btn-box-re-open"><button class="btn-primary btn">Re-Open</button></div>\n';
                            }
                            renderHTML += '</div>';

                            var newElement = document.createElement("div");
                            newElement.innerHTML = renderHTML;
                            elements.divChatContractCounterpartyFooter.appendChild(newElement);

                            var renderHTML = '';
                            var message = '';
                            if (selectedContractSectionDetails.contractSectionData.contractSectionStatus == "Completed") {
                                message = selectedContractSectionDetails.contractSectionData.draftConfirmMessage + " " + selectedContractSectionDetails.contractSectionData.confirmByCounterPartyId.firstName + " " + selectedContractSectionDetails.contractSectionData.confirmByCounterPartyId.lastName + " and " + selectedContractSectionDetails.contractSectionData.confirmByUserId.firstName + " " + selectedContractSectionDetails.contractSectionData.confirmByUserId.lastName;
                            } else {
                                message = 'This contract section has been withdrawn by ' + selectedContractSectionDetails.contractSectionData.contractSectionWithdrawnBy.firstName + " " + selectedContractSectionDetails.contractSectionData.contractSectionWithdrawnBy.lastName;
                            }
                            renderHTML += '<div class="chat-typing-area" id="draftConfirmSS">\n' +
                                '   <div class="position-text">' + message + '</div>\n';
                            if (openContractResponseData.userRole == "Admin" || openContractResponseData.userRole == "Contract Creator" || openContractResponseData.userRole == "Counterparty" || openContractResponseData.userRole == "Position Confirmer") {
                                renderHTML += '   <div class="btn-box btn-box-re-open"><button class="btn-primary btn">Re-Open</button></div>\n';
                            }
                            renderHTML += '</div>';

                            var newElement = document.createElement("div");
                            newElement.innerHTML = renderHTML;
                            elements.divChatContractSameSideFooter.appendChild(newElement);

                            switchClass(elements.divChatSameSideBody, 'contract-completed', true);
                            switchClass(elements.divChatCounterPartyBody, 'contract-completed', true);
                        }
                    } else {
                        var noUserAssigned = '<ul>' +
                            '<li>' +
                            '<p>No user selected</p>' +
                            '</li>' +
                            '</ul>';
                        elements.divInvitedUsers.innerHTML = noUserAssigned;

                        var noTeamAssigned = '<ul>' +
                            '<li>' +
                            '<p>No team selected</p>' +
                            '</li>' +
                            '</ul>';
                        elements.divInvitedTeams.innerHTML = noTeamAssigned;
                    }
                    switchClass(elements.loader, displayNoneClass, true);
                })
                .catch(error => {
                    // Handle any errors
                    console.log('Error #19031631:', error);
                    switchClass(elements.loader, displayNoneClass, true);
                });
        } catch (error) {
            console.log('Error #19031635:', error);
        }
    }

    /**
     * @description This function will used to redirect to chat window where users needs attention
     */
    async function redirectToMessageScreen() {
        try {
            if (selectedThreadID) {
                if (selectedContractSectionDetails && selectedContractSectionDetails.contractSectionData && selectedContractSectionDetails.contractSectionData.contractSectionStatus == "Completed") {
                    chatHistoryNextPage = 1;
                    chatHistoryHasNextPage = true;
                    getClauseConversionHistory();
                    switchClass(elements.sectionContractLists, displayNoneClass, true);
                    switchClass(elements.sectionConversionHistory, displayNoneClass, false);
                } else {
                    switchClass(elements.loader, displayNoneClass, false);
                    let requestURL = apiBaseUrl + '/contract-section/get-required-action-window/' + selectedClauseID + '?sort[createdAt]=-1&page=1&limit=500';
                    var headers = {
                        "Content-Type": "application/json"
                    };
                    if (authToken) headers["Authorization"] = 'Bearer ' + authToken;
                    fetch(requestURL, {headers: headers})
                        .then(response => response.json())
                        .then(response => {
                            if (response && response.status == true && response.code == 200) {
                                var responseData = response.data;
                                if (responseData.total > 0) {
                                    var draftEditRequest = response.data.filter(item => item.messageConfirmationFor == "Same Side" && item.messageType == "Draft Edit Request");
                                    var samesideMessage = response.data.filter(item => item.messageConfirmationFor == "Same Side" && item.messageType !== "Draft Edit Request");
                                    var counterpartyMessage = response.data.filter(item => item.messageConfirmationFor != "Same Side");
                                    if (draftEditRequest && draftEditRequest.length > 0) {
                                        withType = 'Counterparty';
                                        messageConfirmationFor = 'Opposite Side';
                                        elements.conversionCounterparty.innerHTML = '';
                                        chatNextPage = 1;
                                        chatHasNextPage = true;
                                        getContractSectionMessageList('Counterparty');
                                        var chatRoomName = getChatRoom(withType);
                                        socket.emit('joinContractSectionChatRoom', chatRoomName);
                                        elements.messageInputCounterParty.value = "";
                                        switchClass(elements.sectionContractLists, displayNoneClass, true);
                                        switchClass(elements.sectionCounterpartyChat, displayNoneClass, false);
                                        switchClass(elements.sectionSameSideChat, displayNoneClass, true);
                                        switchClass(elements.sectionConversionHistory, displayNoneClass, true);
                                    } else if (samesideMessage && samesideMessage.length > 0) {
                                        withType = 'Our Team';
                                        messageConfirmationFor = 'Same Side';
                                        elements.conversionSameSide.innerHTML = '';
                                        chatNextPage = 1;
                                        chatHasNextPage = true;
                                        getContractSectionMessageList('our');
                                        var chatRoomName = getChatRoom(withType);
                                        socket.emit('joinContractSectionChatRoom', chatRoomName);
                                        elements.messageInputSameSide.value = "";
                                        switchClass(elements.sectionContractLists, displayNoneClass, true);
                                        switchClass(elements.sectionCounterpartyChat, displayNoneClass, true);
                                        switchClass(elements.sectionSameSideChat, displayNoneClass, false);
                                        switchClass(elements.sectionConversionHistory, displayNoneClass, true);
                                    } else if (counterpartyMessage && counterpartyMessage.length > 0) {
                                        withType = 'Counterparty';
                                        messageConfirmationFor = 'Opposite Side';
                                        elements.conversionCounterparty.innerHTML = '';
                                        chatNextPage = 1;
                                        chatHasNextPage = true;
                                        getContractSectionMessageList('Counterparty');
                                        var chatRoomName = getChatRoom(withType);
                                        socket.emit('joinContractSectionChatRoom', chatRoomName);
                                        elements.messageInputCounterParty.value = "";
                                        switchClass(elements.sectionContractLists, displayNoneClass, true);
                                        switchClass(elements.sectionCounterpartyChat, displayNoneClass, false);
                                        switchClass(elements.sectionSameSideChat, displayNoneClass, true);
                                        switchClass(elements.sectionConversionHistory, displayNoneClass, true);
                                    } else {
                                        chatHistoryNextPage = 1;
                                        chatHistoryHasNextPage = true;
                                        getClauseConversionHistory();
                                        switchClass(elements.sectionContractLists, displayNoneClass, true);
                                        switchClass(elements.sectionConversionHistory, displayNoneClass, false);
                                    }
                                } else {
                                    if (chatWindows == 'SS' || clauseChatWindows == 'SS') {
                                        withType = 'Our Team';
                                        messageConfirmationFor = 'Same Side';
                                        elements.conversionSameSide.innerHTML = '';
                                        chatNextPage = 1;
                                        chatHasNextPage = true;
                                        getContractSectionMessageList('our');
                                        var chatRoomName = getChatRoom(withType);
                                        socket.emit('joinContractSectionChatRoom', chatRoomName);
                                        elements.messageInputSameSide.value = "";
                                        switchClass(elements.sectionContractLists, displayNoneClass, true);
                                        switchClass(elements.sectionConversionHistory, displayNoneClass, true);
                                        switchClass(elements.sectionCounterpartyChat, displayNoneClass, true);
                                        switchClass(elements.sectionSameSideChat, displayNoneClass, false);
                                    } else if (chatWindows == 'CP' || clauseChatWindows == 'CP') {
                                        withType = 'Counterparty';
                                        messageConfirmationFor = 'Opposite Side';
                                        elements.conversionCounterparty.innerHTML = '';
                                        chatNextPage = 1;
                                        chatHasNextPage = true;
                                        getContractSectionMessageList('Counterparty');
                                        var chatRoomName = getChatRoom(withType);
                                        socket.emit('joinContractSectionChatRoom', chatRoomName);
                                        elements.messageInputCounterParty.value = "";
                                        switchClass(elements.sectionContractLists, displayNoneClass, true);
                                        switchClass(elements.sectionConversionHistory, displayNoneClass, true);
                                        switchClass(elements.sectionSameSideChat, displayNoneClass, true);
                                        switchClass(elements.sectionCounterpartyChat, displayNoneClass, false);
                                    } else {
                                        chatHistoryNextPage = 1;
                                        chatHistoryHasNextPage = true;
                                        getClauseConversionHistory();
                                        switchClass(elements.sectionContractLists, displayNoneClass, true);
                                        switchClass(elements.sectionSameSideChat, displayNoneClass, true);
                                        switchClass(elements.sectionCounterpartyChat, displayNoneClass, true);
                                        switchClass(elements.sectionConversionHistory, displayNoneClass, false);
                                    }
                                }
                                switchClass(elements.loader, displayNoneClass, true);
                            } else {
                                switchClass(elements.loader, displayNoneClass, true);
                                chatHistoryNextPage = 1;
                                chatHistoryHasNextPage = true;
                                getClauseConversionHistory();
                                switchClass(elements.sectionContractLists, displayNoneClass, true);
                                switchClass(elements.sectionConversionHistory, displayNoneClass, false);
                            }
                        })
                        .catch(error => {
                            // Handle any errors
                            console.log('Error #26031555:', error);
                            switchClass(elements.loader, displayNoneClass, true);
                        });
                }
            }
        } catch (error) {
            console.error('Error #26031230:', error);
            switchClass(elements.loader, displayNoneClass, true);
        }
    }

    /**
     * @description This function will return the contract clause message history
     * @returns {Promise<void>}
     */
    async function getClauseConversionHistory() {
        try {
            switchClass(elements.loader, displayNoneClass, false);

            let requestURL = apiBaseUrl + '/contract-section/get-contract-section-message-list/' + selectedClauseID + '/all';

            var queryParam = [];
            // Set sortby created time
            queryParam.push('sort[createdAt]=-1');
            // Set pageSize
            queryParam.push('page=' + chatHistoryNextPage);
            // Set recordLimit
            queryParam.push('limit=10');
            // Set queryparams
            requestURL += '?' + queryParam.join('&');

            var headers = {
                "Content-Type": "application/json"
            };
            if (authToken) headers["Authorization"] = 'Bearer ' + authToken;
            fetch(requestURL, {headers: headers})
                .then(response => response.json())
                .then(response => {
                    if (response && response.status == true && response.code == 200 && response.data) {
                        if (response.data.data.length > 0) {
                            var responseData;
                            if (chatHistoryNextPage == 1) {
                                elements.conversionHistory.innerHTML = '';
                                responseData = response?.data?.data.reverse();
                                var scrollToOptions = {
                                    top: elements.divChatHistoryBody.scrollHeight,
                                    behavior: 'smooth'
                                };
                                elements.divChatHistoryBody.scrollTo(scrollToOptions);
                            } else {
                                responseData = response?.data?.data;
                            }
                            var setLastHeight = elements.conversionHistory.scrollHeight;

                            responseData.forEach((element, index) => {
                                var renderHTML = '';
                                switch (element.messageType) {
                                    case "Normal":
                                        renderHTML += '<div class="message-wrapper' + (element.conversationType == 'OTM' ? "" : " reverse") + (element.chatWindow == "Counterparty" ? " light-gold-color" : "") + '">\n' +
                                            '       <div class="profile-picture">\n' +
                                            '           <img src="' + (element && element.messageSenderUser && element.messageSenderUser.imageKey ? IMAGE_USER_PATH_LINK + element.messageSenderUser.imageKey : 'images/no-profile-image.jpg') + '" alt="pp">\n' +
                                            '           <p class="name">' + element.messageSenderUser.firstName + ' ' + element.messageSenderUser.lastName + '&nbsp;<small>(' + (element && element.companyId === loggedInCompanyDetails._id ? 'Same side' : 'Counterparty') + ')</small>' + '</p>\n' +
                                            '           <p class="last-seen">' + formatDate(element.createdAt) + '</p>\n' +
                                            '       </div>\n' +
                                            '       <div class="message-content">\n' +
                                            '           <div class="message">' + (element.message ? element.message.trim().replaceAll(/\n/g, '<br>') : '') + '</div>\n' +
                                            '       </div>\n' +
                                            '</div>\n';
                                        break;
                                    case "Invite":
                                        var inviteMessage = '';
                                        var userName = element.messageSenderUser.firstName + " " + element.messageSenderUser.lastName;
                                        if (element.inviteType == 'Team' && element.invitedTeamDetails) {
                                            inviteMessage += element.invitedTeamDetails.teamName;
                                        } else {
                                            var invitedUser = element.invitedUserDetails.firstName + " " + element.invitedUserDetails.lastName;
                                            inviteMessage += invitedUser.trim();
                                        }
                                        inviteMessage += ' ' + element.message + ' ' + userName.trim() + ' in this contract section';
                                        renderHTML += '<div class="message-wrapper' + (element.conversationType == 'OTM' ? "" : " reverse") + '">\n' +
                                            '       <div class="profile-picture">\n' +
                                            '           <img src="' + (element && element.messageSenderUser && element.messageSenderUser.imageKey ? IMAGE_USER_PATH_LINK + element.messageSenderUser.imageKey : 'images/no-profile-image.jpg') + '" alt="pp">\n' +
                                            '           <p class="name">' + userName.trim() + '&nbsp;<small>(' + (element && element.companyId === loggedInCompanyDetails._id ? 'Same side' : 'Counterparty') + ')</small>' + '</p>\n' +
                                            '           <p class="last-seen">' + formatDate(element.createdAt) + '</p>\n' +
                                            '       </div>\n' +
                                            '       <div class="request-row">\n' +
                                            '           <strong>' + inviteMessage + '</strong>\n' +
                                            '       </div>\n' +
                                            '</div>\n';
                                        break;
                                    case "Position Confirmation":
                                        renderHTML += '<div class="message-wrapper' + (element.conversationType == 'OTM' ? "" : " reverse") + (element.chatWindow == "Counterparty" && element.messageStatus != 'Reject' ? " dark-gold-color" : "") + ' ' + (element.messageStatus == 'Reject' ? " red-color" : "") + '">\n' +
                                            '       <div class="profile-picture">\n' +
                                            '           <img src="' + (element && element.messageSenderUser && element.messageSenderUser.imageKey ? IMAGE_USER_PATH_LINK + element.messageSenderUser.imageKey : 'images/no-profile-image.jpg') + '" alt="pp">\n' +
                                            '           <p class="name">' + element.messageSenderUser.firstName + ' ' + element.messageSenderUser.lastName + '&nbsp;<small>(' + (element && element.companyId === loggedInCompanyDetails._id ? 'Same side' : 'Counterparty') + ')</small>' + '</p>\n' +
                                            '           <p class="last-seen">' + formatDate(element.createdAt) + '</p>\n' +
                                            '       </div>\n' +
                                            '       <div class="request-row">\n' +
                                            '           <div class="' + (element.chatWindow == "Counterparty" ? "message-content" : "request-content") + '">\n' +
                                            '               <h4>' + (element.messageStatus == 'None' || element.messageStatus == 'Updated' ? 'Sent a position confirmation <br/> request' : (element.messageStatus == 'Approve' ? 'Position confirmation approved' : 'Position confirmation rejected')) + '</h4>\n' +
                                            '               <div class="' + (element.chatWindow == "Counterparty" ? "message" : "content-message") + '">' + (element.message ? element.message.trim().replaceAll(/\n/g, '<br>') : '') + '</div>\n' +
                                            '           </div>\n' +
                                            '    </div>\n' +
                                            '</div>\n';
                                        break;
                                    case "Draft Request":
                                        renderHTML += '<div class="message-wrapper ' + (element.messageStatus == 'Reject' ? "red-color" : "dark-gold-color") + '">\n' +
                                            '       <div class="profile-picture">\n' +
                                            '           <img src="' + (element && element.messageSenderUser && element.messageSenderUser.imageKey ? IMAGE_USER_PATH_LINK + element.messageSenderUser.imageKey : 'images/no-profile-image.jpg') + '" alt="pp">\n' +
                                            '           <p class="name">' + element.messageSenderUser.firstName + ' ' + element.messageSenderUser.lastName + '&nbsp;<small>(' + (element && element.companyId === loggedInCompanyDetails._id ? 'Same side' : 'Counterparty') + ')</small>' + '</p>\n' +
                                            '           <p class="last-seen">' + formatDate(element.createdAt) + '</p>\n' +
                                            '       </div>\n' +
                                            '       <div class="request-row">\n' +
                                            '           <div class="' + (element.chatWindow == "Counterparty" ? "message-content" : "request-content") + '">\n' +
                                            '               <h4>Draft Request</h4>\n' +
                                            '               <div class="' + (element.chatWindow == "Counterparty" ? "message" : "content-message") + '">' + (element.message ? element.message.trim().replaceAll(/\n/g, '<br>') : '') + '</div>\n' +
                                            '           </div>\n' +
                                            '    </div>\n' +
                                            '</div>\n';
                                        break;
                                    case "Draft Confirmation":
                                        renderHTML += '<div class="message-wrapper ' + (element.messageStatus == 'Reject' ? "red-color" : "dark-gold-color") + '">\n' +
                                            '       <div class="profile-picture">\n' +
                                            '           <img src="' + (element && element.messageSenderUser && element.messageSenderUser.imageKey ? IMAGE_USER_PATH_LINK + element.messageSenderUser.imageKey : 'images/no-profile-image.jpg') + '" alt="pp">\n' +
                                            '           <p class="name">' + element.messageSenderUser.firstName + ' ' + element.messageSenderUser.lastName + '&nbsp;<small>(' + (element && element.companyId === loggedInCompanyDetails._id ? 'Same side' : 'Counterparty') + ')</small>' + '</p>\n' +
                                            '           <p class="last-seen">' + formatDate(element.createdAt) + '</p>\n' +
                                            '       </div>\n' +
                                            '       <div class="request-row">\n' +
                                            '           <div class="' + (element.chatWindow == "Counterparty" ? "message-content" : "request-content") + '">\n' +
                                            '               <h4>' + (element.messageStatus == 'None' || element.messageStatus == 'Updated' ? 'Draft confirmation request' : (element.messageStatus == 'Approve' ? 'Draft confirmation approved' : 'Draft confirmation rejected')) + '</h4>\n' +
                                            '               <div class="' + (element.chatWindow == "Counterparty" ? "message" : "content-message") + '">' + (element.message ? element.message.trim().replaceAll(/\n/g, '<br>') : '') + '</div>\n' +
                                            '           </div>\n' +
                                            '    </div>\n' +
                                            '</div>\n';
                                        break;
                                    case "Notification":
                                        // debugger;
                                        if (element.message == 'Ignore') {
                                            break;
                                        }
                                        var notificationMessage;
                                        var userName = element.messageSenderUser.firstName + " " + element.messageSenderUser.lastName;
                                        if (element.message == 'request_draft_counter') {
                                            if (loggedInCompanyDetails._id == contractInformation.companyId) {
                                                notificationMessage = userName.trim() + " has assigned " + (contractInformation.companyId == element.companyId ? counterPartyCompanyDetail.companyName : loggedInCompanyDetails.companyName) + " to draft this contract section";
                                            } else {
                                                notificationMessage = userName.trim() + " has assigned " + (contractInformation.companyId == element.companyId ? loggedInCompanyDetails.companyName : counterPartyCompanyDetail.companyName) + " to draft this contract section";
                                            }
                                        } else if (element.message == 'request_draft') {
                                            if (element && element.messageReceiverUser) {
                                                var userReceiverName = element.messageReceiverUser.firstName + " " + element.messageReceiverUser.lastName;
                                                notificationMessage = userName.trim() + " has assigned " + userReceiverName.trim() + " to draft this contract section";
                                            } else {
                                                notificationMessage = userName.trim() + " has assigned a team member to draft this contract section";
                                            }
                                        } else if (element.message == 'withdrawn') {
                                            notificationMessage = "Contract section withdrawn by " + userName.trim();
                                        } else {
                                            notificationMessage = element.message + ' ' + userName.trim();
                                        }
                                        renderHTML += '<div class="message-wrapper ' + (element.conversationType == 'OTM' ? " light-gold-color" : " reverse") + '">\n' +
                                            '       <div class="profile-picture">\n' +
                                            '           <img src="' + (element && element.messageSenderUser && element.messageSenderUser.imageKey ? IMAGE_USER_PATH_LINK + element.messageSenderUser.imageKey : 'images/no-profile-image.jpg') + '" alt="pp">\n' +
                                            '           <p class="name">' + element.messageSenderUser.firstName + ' ' + element.messageSenderUser.lastName + '&nbsp;<small>(' + (element && element.companyId === loggedInCompanyDetails._id ? 'Same side' : 'Counterparty') + ')</small>' + '</p>\n' +
                                            '           <p class="last-seen">' + formatDate(element.createdAt) + '</p>\n' +
                                            '       </div>\n' +
                                            '       <div class="request-row">\n' +
                                            '           <strong>' + notificationMessage.replaceAll(/\n/g, '<br>') + '</strong>\n' +
                                            '       </div>\n' +
                                            '</div>\n';
                                        break;
                                    case "Meeting":
                                        renderHTML += '<div class="scheduled-meeting" data-id="' + element.meetingId + '">\n' +
                                            '          <div class="scheduled-meeting-inner">\n' +
                                            '            <div class="scheduled-meeting-icon">\n' +
                                            '              <img src="images/schedule-meeting-icon.svg"\n' +
                                            '                alt="Schedule Meeting Icon" />\n' +
                                            '            </div>\n' +
                                            '            <div class="scheduled-meeting-content">\n' +
                                            '              <h3>' + element.meetingDetails.meetingTitle + '</h3>\n' +
                                            '              <p>Scheduled Meeting</p>\n' +
                                            '              <span>' + formatDateForMeeting(element.meetingDetails.meetingDate) + ' &#183; ' + element.meetingDetails.meetingStartTime + ' - ' + element.meetingDetails.meetingEndTime + '</span>\n' +
                                            '            </div>\n' +
                                            '          </div>\n' +
                                            '        </div>';
                                        break;
                                    default:
                                        renderHTML += '<div class="message-wrapper' + (element.conversationType == 'OTM' ? "" : " reverse") + (element.chatWindow == "Counterparty" ? " light-gold-color" : "") + '">\n' +
                                            '       <div class="profile-picture">\n' +
                                            '           <img src="' + (element && element.messageSenderUser && element.messageSenderUser.imageKey ? IMAGE_USER_PATH_LINK + element.messageSenderUser.imageKey : 'images/no-profile-image.jpg') + '" alt="pp">\n' +
                                            '           <p class="name">' + element.messageSenderUser.firstName + ' ' + element.messageSenderUser.lastName + '&nbsp;<small>(' + (element && element.companyId === loggedInCompanyDetails._id ? 'Same side' : 'Counterparty') + ')</small>' + '</p>\n' +
                                            '           <p class="last-seen">' + formatDate(element.createdAt) + '</p>\n' +
                                            '       </div>\n' +
                                            '       <div class="message-content">\n' +
                                            '           <div class="message">' + (element.message ? element.message.trim().replaceAll(/\n/g, '<br>') : '') + '</div>\n' +
                                            '       </div>\n' +
                                            '</div>\n';
                                        break;
                                }
                                if (chatHistoryNextPage == 1) {
                                    var newElement = document.createElement("div");
                                    newElement.setAttribute('data-message', index + 1);
                                    newElement.innerHTML = renderHTML;
                                    elements.conversionHistory.appendChild(newElement);
                                    // targetDiv.before(html);
                                } else {
                                    var newElement = document.createElement("div");
                                    newElement.setAttribute('data-message', index + 1);
                                    newElement.innerHTML = renderHTML;
                                    elements.conversionHistory.insertBefore(newElement, elements.conversionHistory.firstChild);
                                }
                            });

                            var scrollToOptions = {
                                top: elements.divChatHistoryBody.scrollHeight,
                                behavior: 'smooth'
                            };
                            if (chatHistoryNextPage == 1) {
                                elements.divChatHistoryBody.scrollTo(scrollToOptions);
                            } else {
                                elements.divChatHistoryBody.scrollTop = elements.divChatHistoryBody.scrollHeight - setLastHeight;
                            }
                            chatHistoryHasNextPage = response.data.hasNextPage;
                            chatHistoryNextPage = response.data.nextPage;
                            switchClass(elements.loader, displayNoneClass, true);
                        } else {
                            elements.conversionHistory.innerHTML = '';
                            switchClass(elements.loader, displayNoneClass, true);
                        }
                    } else {
                        switchClass(elements.loader, displayNoneClass, true);
                    }
                })
                .catch(error => {
                    // Handle any errors
                    console.log('Error #26031560:', error);
                    switchClass(elements.loader, displayNoneClass, true);
                });
        } catch (error) {
            console.log('Error #19031635:', error);
            switchClass(elements.loader, displayNoneClass, true);
        }
    }

    /**
     * @description This function will return the contract clause messages
     * @param messageType
     * @returns {Promise<void>}
     */
    async function getContractSectionMessageList(messageType = 'our') {
        try {
            switchClass(elements.loader, displayNoneClass, false);

            let requestURL = apiBaseUrl + '/contract-section/get-contract-section-message-list/' + selectedClauseID + '/' + messageType;

            var queryParam = [];
            // Set sortby created time
            queryParam.push('sort[createdAt]=-1');
            // Set pageSize
            queryParam.push('page=' + chatNextPage);
            // Set recordLimit
            queryParam.push('limit=10');
            // Set queryparams
            requestURL += '?' + queryParam.join('&');

            var headers = {
                "Content-Type": "application/json"
            };
            if (authToken) headers["Authorization"] = 'Bearer ' + authToken;
            fetch(requestURL, {headers: headers})
                .then(response => response.json())
                .then(response => {
                    if (response && response.status == true && response.code == 200 && response.data) {
                        if (response.data.data.length > 0) {
                            var responseData;
                            if (chatNextPage == 1) {
                                if (messageType == 'our') {
                                    elements.conversionSameSide.innerHTML = '';
                                    responseData = response?.data?.data.reverse();
                                    var scrollToOptions = {
                                        top: elements.divChatSameSideBody.scrollHeight,
                                        behavior: 'smooth'
                                    };
                                    elements.divChatSameSideBody.scrollTo(scrollToOptions);
                                } else {
                                    elements.conversionCounterparty.innerHTML = '';
                                    responseData = response?.data?.data.reverse();
                                    var scrollToOptions = {
                                        top: elements.divChatCounterPartyBody.scrollHeight,
                                        behavior: 'smooth'
                                    };
                                    elements.divChatCounterPartyBody.scrollTo(scrollToOptions);
                                }
                            } else {
                                responseData = response?.data?.data;
                            }
                            var setLastHeight;
                            if (messageType == 'our') {
                                setLastHeight = elements.conversionSameSide.scrollHeight;
                            } else {
                                setLastHeight = elements.conversionCounterparty.scrollHeight;
                            }

                            responseData.forEach((element, index) => {
                                var renderHTML = '';
                                switch (element.messageType) {
                                    case "Invite":
                                        var inviteMessage = '';
                                        var userName = element.messageSenderUser.firstName + " " + element.messageSenderUser.lastName;
                                        if (element.inviteType == 'Team' && element.invitedTeamDetails) {
                                            inviteMessage += element.invitedTeamDetails.teamName;
                                        } else {
                                            var invitedUser = element.invitedUserDetails.firstName + " " + element.invitedUserDetails.lastName;
                                            inviteMessage += invitedUser.trim();
                                        }
                                        inviteMessage += ' ' + element.message + ' ' + userName.trim() + ' in this contract section';
                                        renderHTML += '<div class="message-wrapper' + (element.from == loggedInUserDetails._id ? " reverse" : "") + (element.chatWindow == "Counterparty" ? " light-gold-color" : "") + '">\n' +
                                            '       <div class="profile-picture">\n' +
                                            '           <img src="' + (element && element.messageSenderUser && element.messageSenderUser.imageKey ? IMAGE_USER_PATH_LINK + element.messageSenderUser.imageKey : 'images/no-profile-image.jpg') + '" alt="pp">\n' +
                                            '           <p class="name">' + userName.trim() + '</p>\n' +
                                            '           <p class="last-seen">' + formatDate(element.createdAt) + '</p>\n' +
                                            '       </div>\n' +
                                            '       <div class="request-row">\n' +
                                            '           <strong>' + inviteMessage + '</strong>\n' +
                                            '       </div>\n' +
                                            '</div>\n';
                                        break;
                                    case "Position Confirmation":
                                        renderHTML += '<div class="message-wrapper' + (element.from == loggedInUserDetails._id ? " reverse" : "") + (messageType == "Counterparty" && element.messageStatus != 'Reject' ? " dark-gold-color" : "") + ' ' + (element.messageStatus == 'Reject' ? " red-color" : "") + '">\n' +
                                            '       <div class="profile-picture">\n' +
                                            '           <img src="' + (element && element.messageSenderUser && element.messageSenderUser.imageKey ? IMAGE_USER_PATH_LINK + element.messageSenderUser.imageKey : 'images/no-profile-image.jpg') + '" alt="pp">\n' +
                                            '           <p class="name">' + element.messageSenderUser.firstName + ' ' + element.messageSenderUser.lastName + '</p>\n' +
                                            '           <p class="last-seen">' + formatDate(element.createdAt) + '</p>\n' +
                                            '       </div>\n' +
                                            '       <div class="request-row">\n' +
                                            '           <div class="' + (messageType == "Counterparty" ? "message-content" : "request-content") + '">\n' +
                                            '               <h4>' + (element.messageStatus == 'None' || element.messageStatus == 'Updated' ? 'Sent a position confirmation <br/> request' : (element.messageStatus == 'Approve' ? 'Position confirmation approved' : 'Position confirmation rejected')) + '</h4>\n' +
                                            '               <div class="' + (messageType == "Counterparty" ? "message" : "content-message") + '">' + (element.message ? element.message.trim().replaceAll(/\n/g, '<br>') : '') + '</div>\n' +
                                            '           </div>\n';
                                        if (messageType == 'Counterparty') {
                                            if (element.from != loggedInUserDetails._id && element.companyId != loggedInCompanyDetails._id && element.messageStatus == 'None' && openContractResponseData.canConfirmPosition) {
                                                renderHTML += '        <div class="request-btn">\n' +
                                                    '               <button class="btn btn-primary ' + (element.with != 'Counterparty' ? "approve-possition" : "reconfirm-approve") + '" data-action="Approve" data-id="' + element._id + '" >Approve</button>\n' +
                                                    '               <button class="btn reject-btn reconfirm-reject" data-action="Reject"  data-id="' + element._id + '" >Reject</button>\n' +
                                                    '           </div>\n';
                                            }
                                        } else {
                                            if (element.from != loggedInUserDetails._id && element.messageStatus == 'None' && openContractResponseData.canConfirmPosition) {
                                                renderHTML += '        <div class="request-btn">\n' +
                                                    '               <button class="btn btn-primary ' + (element.with != 'Counterparty' ? "approve-possition" : "reconfirm-approve") + '" data-action="Approve" data-id="' + element._id + '" >Approve</button>\n' +
                                                    '               <button class="btn reject-btn reconfirm-reject" data-action="Reject"  data-id="' + element._id + '" >Reject</button>\n' +
                                                    '           </div>\n';
                                            }
                                        }
                                        renderHTML += '    </div>\n' +
                                            '</div>\n';
                                        break;
                                    case "Draft Request":
                                        renderHTML += '<div class="message-wrapper' + (element.from == loggedInUserDetails._id ? " reverse" : "") + (messageType == "Counterparty" && element.messageStatus != 'Reject' ? " dark-gold-color" : "") + ' ' + (element.messageStatus == 'Reject' ? " red-color" : "") + '">\n' +
                                            '       <div class="profile-picture">\n' +
                                            '           <img src="' + (element && element.messageSenderUser && element.messageSenderUser.imageKey ? IMAGE_USER_PATH_LINK + element.messageSenderUser.imageKey : 'images/no-profile-image.jpg') + '" alt="pp">\n' +
                                            '           <p class="name">' + element.messageSenderUser.firstName + ' ' + element.messageSenderUser.lastName + '</p>\n' +
                                            '           <p class="last-seen">' + formatDate(element.createdAt) + '</p>\n' +
                                            '       </div>\n' +
                                            '       <div class="request-row">\n' +
                                            '           <div class="' + (messageType == "Counterparty" ? "message-content" : "request-content") + '">\n' +
                                            '               <h4>Draft Request</h4>\n' +
                                            '               <div class="' + (messageType == "Counterparty" ? "message" : "content-message") + '">' + (element.message ? element.message.trim().replaceAll(/\n/g, '<br>') : '') + '</div>\n' +
                                            '           </div>\n';
                                        if (element.with == 'Our Team' && element.messageStatus == 'None' && element.sendTo == null && (openContractResponseData.userRole == 'Contract Creator' || openContractResponseData.userRole == 'Admin' || openContractResponseData.userRole == 'Counterparty')) {
                                            renderHTML += '        <div class="request-btn">\n' +
                                                '               <button class="btn btn-primary assign-user" data-action="assign-user" data-id="' + element._id + '">Assign for Drafting</button>\n' +
                                                '           </div>\n';
                                        }
                                        renderHTML += '    </div>\n' +
                                            '</div>\n';
                                        break;
                                    case "Draft Confirmation":
                                        renderHTML += '<div class="message-wrapper' + (element.from == loggedInUserDetails._id ? " reverse" : "") + (element.with == "Counterparty" && element.messageStatus != ' Reject' ? " dark-gold-color" : "") + ' ' + (element.messageStatus == 'Reject' ? " red-color" : "") + '">\n' +
                                            '       <div class="profile-picture">\n' +
                                            '           <img src="' + (element && element.messageSenderUser && element.messageSenderUser.imageKey ? IMAGE_USER_PATH_LINK + element.messageSenderUser.imageKey : 'images/no-profile-image.jpg') + '" alt="pp">\n' +
                                            '           <p class="name">' + element.messageSenderUser.firstName + ' ' + element.messageSenderUser.lastName + '</p>\n' +
                                            '           <p class="last-seen">' + formatDate(element.createdAt) + '</p>\n' +
                                            '       </div>\n' +
                                            '       <div class="request-row">\n' +
                                            '           <div class="' + (element.with == "Counterparty" ? "message-content" : "request-content") + '">\n' +
                                            '               <h4>' + (element.messageStatus == 'None' || element.messageStatus == 'Updated' ? 'Draft confirmation request' : (element.messageStatus == 'Approve' ? 'Draft confirmation approved' : 'Draft confirmation rejected')) + '</h4>\n' +
                                            '               <div class="' + (element.with == "Counterparty" ? "message" : "content-message") + '">' + (element.message ? element.message.trim().replaceAll(/\n/g, '<br>') : '') + '</div>\n' +
                                            '           </div>\n';
                                        if (element.from != loggedInUserDetails._id && element.messageStatus == 'None' && openContractResponseData.canConfirmPosition && (openContractResponseData.userRole == 'Contract Creator' || openContractResponseData.userRole == 'Admin' || openContractResponseData.userRole == 'Counterparty')) {
                                            renderHTML += '        <div class="request-btn">\n' +
                                                '               <button class="btn btn-primary draft-approve" data-action="Approve" data-id="' + element._id + '" >Approve</button>\n' +
                                                '               <button class="btn reject-btn  draft-reject " data-action="Reject"  data-id="' + element._id + '" >Reject</button>\n' +
                                                '           </div>\n';
                                        }
                                        renderHTML += '       </div>\n' +
                                            '</div>\n';
                                        break;
                                    case "Notification":
                                        var notificationMessage;
                                        var userName = element.messageSenderUser.firstName + " " + element.messageSenderUser.lastName;
                                        if (element.message == 'request_draft_counter') {
                                            notificationMessage = userName.trim() + " has assigned " + (loggedInCompanyDetails._id !== element.companyId ? loggedInCompanyDetails.companyName : counterPartyCompanyDetail.companyName) + " to draft this contract section";
                                        } else if (element.message == 'request_draft') {
                                            if (element && element.messageReceiverUser) {
                                                var userReceiverName = element.messageReceiverUser.firstName + " " + element.messageReceiverUser.lastName;
                                                notificationMessage = userName.trim() + " has assigned " + userReceiverName.trim() + " to draft this contract section";
                                            } else {
                                                notificationMessage = userName.trim() + " has assigned a team member to draft this contract section";
                                            }
                                        } else if (element.message == 'withdrawn') {
                                            notificationMessage = "Contract section withdrawn by " + userName.trim();
                                        } else {
                                            notificationMessage = element.message + ' ' + userName.trim();
                                        }
                                        renderHTML += '<div class="message-wrapper' + (element.from == loggedInUserDetails._id ? " reverse" : "") + (messageType == "Counterparty" ? " light-gold-color" : "") + '">\n' +
                                            '       <div class="profile-picture">\n' +
                                            '           <img src="' + (element && element.messageSenderUser && element.messageSenderUser.imageKey ? IMAGE_USER_PATH_LINK + element.messageSenderUser.imageKey : 'images/no-profile-image.jpg') + '" alt="pp">\n' +
                                            '           <p class="name">' + element.messageSenderUser.firstName + ' ' + element.messageSenderUser.lastName + '</p>\n' +
                                            '           <p class="last-seen">' + formatDate(element.createdAt) + '</p>\n' +
                                            '       </div>\n' +
                                            '       <div class="request-row">\n' +
                                            '           <strong>' + (notificationMessage ? notificationMessage.trim().replaceAll(/\n/g, '<br>') : '') + '</strong>\n' +
                                            '       </div>\n' +
                                            '</div>\n';
                                        break;
                                    case "Meeting":
                                        renderHTML += '<div class="scheduled-meeting" data-id="' + element.meetingId + '">\n' +
                                            '          <div class="scheduled-meeting-inner">\n' +
                                            '            <div class="scheduled-meeting-icon">\n' +
                                            '              <img src="images/schedule-meeting-icon.svg"\n' +
                                            '                alt="Schedule Meeting Icon" />\n' +
                                            '            </div>\n' +
                                            '            <div class="scheduled-meeting-content">\n' +
                                            '              <h3>' + element.meetingDetails.meetingTitle + '</h3>\n' +
                                            '              <p>Scheduled Meeting</p>\n' +
                                            '              <span>' + formatDateForMeeting(element.meetingDetails.meetingDate) + ' &#183; ' + element.meetingDetails.meetingStartTime + ' - ' + element.meetingDetails.meetingEndTime + '</span>\n' +
                                            '            </div>\n' +
                                            '          </div>\n' +
                                            '        </div>';
                                        break;
                                    default:
                                        renderHTML += '<div class="message-wrapper' + (element.from == loggedInUserDetails._id ? " reverse" : "") + (element.chatWindow == "Counterparty" ? " light-gold-color" : "") + '">\n' +
                                            '       <div class="profile-picture">\n' +
                                            '           <img src="' + (element && element.messageSenderUser && element.messageSenderUser.imageKey ? IMAGE_USER_PATH_LINK + element.messageSenderUser.imageKey : 'images/no-profile-image.jpg') + '" alt="pp">\n' +
                                            '           <p class="name">' + element.messageSenderUser.firstName + ' ' + element.messageSenderUser.lastName + '</p>\n' +
                                            '           <p class="last-seen">' + formatDate(element.createdAt) + '</p>\n' +
                                            '       </div>\n' +
                                            '       <div class="message-content">\n' +
                                            '           <div class="message">' + (element.message ? element.message.trim().replaceAll(/\n/g, '<br>') : '') + '</div>\n' +
                                            '       </div>\n' +
                                            '</div>\n';
                                        break;
                                }
                                if (chatNextPage == 1) {
                                    var contentDiv;
                                    if (messageType == 'our') {
                                        var newElement = document.createElement("div");
                                        newElement.innerHTML = renderHTML;
                                        elements.conversionSameSide.appendChild(newElement);
                                    } else {
                                        var newElement = document.createElement("div");
                                        newElement.innerHTML = renderHTML;
                                        elements.conversionCounterparty.appendChild(newElement);
                                    }
                                    // targetDiv.before(html);
                                } else {
                                    if (messageType == 'our') {
                                        var newElement = document.createElement("div");
                                        newElement.innerHTML = renderHTML;
                                        elements.conversionSameSide.insertBefore(newElement, elements.conversionSameSide.firstChild);
                                    } else {
                                        var newElement = document.createElement("div");
                                        newElement.innerHTML = renderHTML;
                                        elements.conversionCounterparty.insertBefore(newElement, elements.conversionCounterparty.firstChild);
                                    }
                                }
                            });

                            var myDiv;
                            if (messageType == 'our') {
                                myDiv = elements.divChatSameSideBody;
                            } else {
                                myDiv = elements.divChatCounterPartyBody;
                            }
                            var scrollToOptions = {
                                top: myDiv.scrollHeight,
                                behavior: 'smooth'
                            };
                            if (chatNextPage == 1) {
                                myDiv.scrollTo(scrollToOptions);
                            } else {
                                if (messageType == 'our') {
                                    elements.divChatSameSideBody.scrollTop = elements.conversionSameSide.scrollHeight - setLastHeight;
                                } else {
                                    elements.divChatCounterPartyBody.scrollTop = elements.conversionCounterparty.scrollHeight - setLastHeight;
                                }
                            }
                            chatHasNextPage = response.data.hasNextPage;
                            chatNextPage = response.data.nextPage;
                            switchClass(elements.loader, displayNoneClass, true);
                        } else {
                            elements.conversionHistory.innerHTML = '';
                            switchClass(elements.loader, displayNoneClass, true);
                        }
                    } else {
                        switchClass(elements.loader, displayNoneClass, true);
                    }
                })
                .catch(error => {
                    // Handle any errors
                    console.log('Error #26031565:', error);
                    switchClass(elements.loader, displayNoneClass, true);
                });
        } catch (error) {
            console.log('Error #19031635:', error);
            switchClass(elements.loader, displayNoneClass, true);
        }
    }

    /**
     * @description This method is used for send clause message
     * @param postData
     * @param socket
     * @returns {Promise<void>}
     */
    async function addContractSectionMessage(postData, socket) {
        try {
            switchClass(elements.loader, displayNoneClass, false);
            var data = JSON.stringify(postData);
            var requestURL = apiBaseUrl + '/contract-section/add-message-contract-section';
            var headers = {
                "Content-Type": "application/json"
            };
            if (authToken) headers["Authorization"] = 'Bearer ' + authToken;
            var requestOptions = {
                method: 'POST',
                headers: headers,
                body: data
            };
            fetch(requestURL, requestOptions)
                .then(response => response.json())
                .then(response => {
                    // Handle the response data
                    // var responseData = response;
                    // console.log('responseData', responseData);
                    if (response && response.status == true && response.code == 200) {
                        postData._id = response.data._id;
                        var conversationType = 'OTM';
                        if (loggedInCompanyDetails._id.toString() == contractInformation.companyId.toString() && postData.with == "Our Team") {
                            conversationType = 'OTCC';
                        } else if (loggedInCompanyDetails._id.toString() == contractInformation.counterPartyCompanyId.toString() && postData.with == "Our Team") {
                            conversationType = 'OTCP';
                        }

                        socket.emit('contractSectionMessage', postData);
                        var generalChatData = postData;
                        generalChatData.chatRoomName = 'conversionHistory_' + selectedThreadID;
                        generalChatData.conversationType = conversationType;
                        socket.emit('conversionHistoryMessage', generalChatData);

                        if (selectedContractSectionDetails && selectedContractSectionDetails.contractSectionData && (selectedContractSectionDetails.contractSectionData.isVisibleToCounterparty == false || selectedContractSectionDetails.contractSectionData.isVisibleToContractCreator == false)) {
                            getContractSectionDetails();
                            var data = {
                                chatRoomName: contractID,
                                refreshClauseList: true
                            };
                            socket.emit('refreshClauseList', data);
                        }

                        if (postData.with == "Counterparty") {
                            elements.messageInputCounterParty.innerHTML = '';
                        } else {
                            elements.messageInputSameSide.innerHTML = '';
                        }
                        var renderHTML = '';
                        switch (postData.messageType) {
                            case "Position Confirmation":
                                renderHTML += '<div class="message-wrapper reverse ' + (postData.with == "Counterparty" ? "dark-gold-color" : "") + '">\n' +
                                    '       <div class="profile-picture">\n' +
                                    '           <img src="' + (postData.actionperformedbyUserImage ? IMAGE_USER_PATH_LINK + postData.actionperformedbyUserImage : 'images/no-profile-image.jpg') + '" alt="pp">\n' +
                                    '           <p class="name">' + postData.actionperformedbyUser + '</p>\n' +
                                    '           <p class="last-seen">' + formatDate(new Date()) + '</p>\n' +
                                    '       </div>\n' +
                                    '       <div class="request-row">\n' +
                                    '           <div class="' + (postData.with == "Counterparty" ? "message-content" : "request-content") + '">\n' +
                                    '               <h4>' + 'Sent a position confirmation <br/> request' + '</h4>\n' +
                                    '               <div class="' + (postData.with == "Counterparty" ? "message" : "content-message") + '">' + (postData.message ? postData.message.trim().replaceAll(/\n/g, '<br>') : '') + '</div>\n' +
                                    '           </div>\n' +
                                    '    </div>\n' +
                                    '</div>\n';
                                break;
                            case "Draft Confirmation":
                                renderHTML += '<div class="message-wrapper reverse ' + (postData.with == "Counterparty" ? "dark-gold-color" : "") + '">\n' +
                                    '       <div class="profile-picture">\n' +
                                    '           <img src="' + (postData.actionperformedbyUserImage ? IMAGE_USER_PATH_LINK + postData.actionperformedbyUserImage : 'images/no-profile-image.jpg') + '" alt="pp">\n' +
                                    '           <p class="name">' + postData.actionperformedbyUser + '</p>\n' +
                                    '           <p class="last-seen">' + formatDate(new Date()) + '</p>\n' +
                                    '       </div>\n' +
                                    '       <div class="request-row">\n' +
                                    '           <div class="' + (postData.with == "Counterparty" ? "message-content" : "request-content") + '">\n' +
                                    '               <h4>Draft confirmation request</h4>\n' +
                                    '               <div class="' + (postData.with == "Counterparty" ? "message" : "content-message") + '">' + (postData.message ? postData.message.trim().replaceAll(/\n/g, '<br>') : '') + '</div>\n' +
                                    '           </div>\n';
                                renderHTML += '    </div>\n' +
                                    '</div>\n';
                                if (typeof window.Asc.plugin.executeMethod === 'function') {
                                    var sDocumentEditingRestrictions = "readOnly";
                                    window.Asc.plugin.executeMethod("SetEditingRestrictions", [sDocumentEditingRestrictions]);
                                }
                                break;
                            default:
                                renderHTML += '<div class="message-wrapper reverse ' + (postData.with == "Counterparty" ? "light-gold-color" : "") + ' ">\n' +
                                    '   <div class="profile-picture">\n' +
                                    '      <img src="' + (postData.actionperformedbyUserImage ? IMAGE_USER_PATH_LINK + postData.actionperformedbyUserImage : 'images/no-profile-image.jpg') + '" alt="pp">\n' +
                                    '      <p class="name">' + postData.actionperformedbyUser + '</p>\n' +
                                    '      <p class="last-seen">' + formatDate(new Date()) + '</p>\n' +
                                    '   </div>\n' +
                                    '   <div class="message-content">\n' +
                                    '      <div class="message">' + (postData.message ? postData.message.trim().replaceAll(/\n/g, '<br>') : '') + '</div>\n' +
                                    '   </div>\n' +
                                    '</div>\n';
                                break
                        }


                        if (postData.with == "Counterparty") {
                            var newElement = document.createElement("div");
                            newElement.innerHTML = renderHTML;
                            elements.conversionCounterparty.appendChild(newElement);

                            var scrollToOptions = {
                                top: elements.divChatCounterPartyBody.scrollHeight,
                                behavior: 'smooth'
                            };
                            elements.divChatCounterPartyBody.scrollTo(scrollToOptions);
                        } else {
                            var newElement = document.createElement("div");
                            newElement.innerHTML = renderHTML;
                            elements.conversionSameSide.appendChild(newElement);

                            var scrollToOptions = {
                                top: elements.divChatSameSideBody.scrollHeight,
                                behavior: 'smooth'
                            };
                            elements.divChatSameSideBody.scrollTo(scrollToOptions);
                        }
                        closeBottomPopup();
                    }
                    switchClass(elements.loader, displayNoneClass, true);
                })
                .catch(error => {
                    // Handle any errors
                    console.log('Error #29031200:', error);
                    switchClass(elements.loader, displayNoneClass, true);
                });
        } catch (error) {
            console.log('Error #29031150:', error);
            switchClass(elements.loader, displayNoneClass, true);
        }
    }

    /**
     * @description This method is used for update the contract section confirmation request status Approve/Reject
     * @param postData
     * @param socket
     * @returns {Promise<void>}
     */
    async function updateContractSectionConfirmationStatus(postData, socket) {
        try {
            switchClass(elements.loader, displayNoneClass, false);
            var data = JSON.stringify(postData);
            var requestURL = apiBaseUrl + '/contract-section/update-message-status-contract-section';
            var headers = {
                "Content-Type": "application/json"
            };
            if (authToken) headers["Authorization"] = 'Bearer ' + authToken;
            var requestOptions = {
                method: 'POST',
                headers: headers,
                body: data
            };
            fetch(requestURL, requestOptions)
                .then(response => response.json())
                .then(response => {
                    // debugger;
                    // Handle the response data
                    elements.formReconfirmPosition.reset();
                    elements.formRejectPosition.reset();
                    elements.formAssignDraftRequest.reset();
                    elements.formRejectDraft.reset();
                    elements.formRejectDraftRequest.reset();
                    // Handle the response data
                    // var responseData = response;t
                    // console.log('responseData', responseData);
                    if (response && response.status == true && response.code == 200) {
                        if (postData.messageType == 'Notification' && postData.confirmationType == 'request_draft') {
                            if (postData.sendTo) {
                                socket.emit('contractSectionMessage', postData);
                            } else {
                                if (!(response.data && response.data.flagDraftAssigned)) {
                                    socket.emit('contractSectionMessage', postData);
                                }
                            }
                        } else {
                            socket.emit('contractSectionMessage', postData);
                        }
                        postData._id = response.data._id;
                        var conversationType = 'OTM';
                        if (loggedInCompanyDetails._id.toString() == contractInformation.companyId.toString() && postData.with == "Our Team") {
                            conversationType = 'OTCC';
                        } else if (loggedInCompanyDetails._id.toString() == contractInformation.counterPartyCompanyId.toString() && postData.with == "Our Team") {
                            conversationType = 'OTCP';
                        }

                        var generalChatData = postData;
                        generalChatData.chatRoomName = 'conversionHistory_' + selectedThreadID;
                        generalChatData.conversationType = conversationType;
                        socket.emit('conversionHistoryMessage', generalChatData);

                        if (postData.with == "Counterparty") {
                            elements.messageInputCounterParty.innerHTML = '';
                        } else {
                            elements.messageInputSameSide.innerHTML = '';
                        }
                        var renderHTML = '';
                        switch (postData.confirmationType) {
                            case "position":
                                renderHTML += '<div class="message-wrapper reverse' + (postData.status == 'rejected' ? ' red-color' : '') + '">\n' +
                                    '   <div class="profile-picture">\n' +
                                    '      <img src="' + (postData.actionperformedbyUserImage ? IMAGE_USER_PATH_LINK + postData.actionperformedbyUserImage : 'images/no-profile-image.jpg') + '" alt="pp">\n' +
                                    '      <p class="name">' + postData.actionperformedbyUser + '</p>\n' +
                                    '      <p class="last-seen">' + formatDate(new Date()) + '</p>\n' +
                                    '   </div>\n' +
                                    '   <div class="request-row">\n';
                                if (postData.status == 'rejected') {
                                    renderHTML += '   <div class="request-content">\n' +
                                        '      <h4>Position confirmation rejected</h4>\n' +
                                        '      <div class="message">' + (postData.message ? postData.message.trim().replaceAll(/\n/g, '<br>') : '') + '</div>\n' +
                                        '   </div>\n';
                                } else {
                                    renderHTML += ' <strong>Position approved by ' + postData.actionperformedbyUser + '</strong>\n';
                                }
                                renderHTML += '</div>\n' +
                                    '</div>';
                                if (postData.status == 'rejected') {
                                    renderHTML += '<div class="message-wrapper reverse' + (postData.with == "Counterparty" ? " light-gold-color" : "") + '">\n' +
                                        '   <div class="profile-picture">\n' +
                                        '      <img src="' + (postData.actionperformedbyUserImage ? IMAGE_USER_PATH_LINK + postData.actionperformedbyUserImage : 'images/no-profile-image.jpg') + '" alt="pp">\n' +
                                        '      <p class="name">' + postData.actionperformedbyUser + '</p>\n' +
                                        '      <p class="last-seen">' + formatDate(new Date()) + '</p>\n' +
                                        '   </div>\n' +
                                        '   <div class="request-row">\n' +
                                        '       <strong>Position rejected by ' + postData.actionperformedbyUser + '</strong>\n' +
                                        '   </div>\n' +
                                        '</div>';
                                }
                                break;
                            case "request_draft":
                                if (postData.sendTo) {
                                    renderHTML += '<div class="message-wrapper reverse light-gold-color">\n' +
                                        '   <div class="profile-picture">\n' +
                                        '      <img src="' + (postData.actionperformedbyUserImage ? IMAGE_USER_PATH_LINK + postData.actionperformedbyUserImage : 'images/no-profile-image.jpg') + '" alt="pp">\n' +
                                        '      <p class="name">' + postData.actionperformedbyUser + '</p>\n' +
                                        '      <p class="last-seen">' + formatDate(new Date()) + '</p>\n' +
                                        '   </div>\n' +
                                        '   <div class="request-row">\n' +
                                        '      <strong>' + postData.actionperformedbyUser + ' has assigned a team member to draft this contract section</strong>\n' +
                                        '   </div>\n' +
                                        '</div>';
                                    if (postData.messageConfirmationFor != "Same Side") {
                                        renderHTML += '<div class="message-wrapper reverse ' + (postData.with == "Counterparty" ? "dark-gold-color" : "") + '">\n' +
                                            '   <div class="profile-picture">\n' +
                                            '      <img src="' + (postData.actionperformedbyUserImage ? IMAGE_USER_PATH_LINK + postData.actionperformedbyUserImage : 'images/no-profile-image.jpg') + '" alt="pp">\n' +
                                            '      <p class="name">' + postData.actionperformedbyUser + '</p>\n' +
                                            '      <p class="last-seen">' + formatDate(new Date()) + '</p>\n' +
                                            '   </div>\n' +
                                            '   <div class="request-row dudhiya-color">\n' +
                                            '      <div class="message-content">\n' +
                                            '         <h4>Draft contract request</h4>\n' +
                                            '           <div class="message">\n' +
                                            '               <p>Draft Request: ' + (postData.message ? postData.message.trim().replaceAll(/\n/g, '<br>') : '') + '</p>\n' +
                                            '               <p>Note: ' + postData.actionperformedbyUser + ' has requested to give contract draft edit request to ' + postData.sendToName + '</p>\n' +
                                            '           </div>\n' +
                                            '      </div>\n' +
                                            '   </div>\n' +
                                            '</div>';
                                    }
                                    switchClass(elements.btnWithdrawnClauseSameSide, displayNoneClass, true);
                                    getContractDetails(socket, false);
                                } else {
                                    renderHTML += '<div class="message-wrapper reverse ' + (postData.with == "Counterparty" ? "dark-gold-color" : "") + '">\n' +
                                        '   <div class="profile-picture">\n' +
                                        '      <img src="' + (postData.actionperformedbyUserImage ? IMAGE_USER_PATH_LINK + postData.actionperformedbyUserImage : 'images/no-profile-image.jpg') + '" alt="pp">\n' +
                                        '      <p class="name">' + postData.actionperformedbyUser + '</p>\n' +
                                        '      <p class="last-seen">' + formatDate(new Date()) + '</p>\n' +
                                        '   </div>\n' +
                                        '   <div class="request-row">\n' +
                                        '      <div class="message-content">\n' +
                                        '         <h4>Draft Request</h4>\n' +
                                        '         <div class="message">' + (postData.message ? postData.message.trim().replaceAll(/\n/g, '<br>') : '') + '</div>\n' +
                                        '      </div>\n' +
                                        '   </div>\n' +
                                        '</div>';
                                    var message = '';
                                    if (response.data.flagDraftAssigned) {
                                        postData.flagDraftAssigned = response.data.flagDraftAssigned;
                                        postData.assignedUserDetails = postData.sendToName;
                                        socket.emit('contractSectionMessage', postData);
                                        message = postData.actionperformedbyUser + ' has assigned ' + (postData.sendToName ? postData.sendToName : "") + ' to draft this contract section';
                                    } else {
                                        message = postData.actionperformedbyUser + ' has assigned ' + (loggedInCompanyDetails._id !== postData.companyId ? loggedInCompanyDetails.companyName : counterPartyCompanyDetail.companyName) + ' to draft this contract section';
                                    }
                                    renderHTML += '<div class="message-wrapper reverse ' + (postData.with == "Counterparty" ? "light-gold-color" : "") + ' ">\n' +
                                        '   <div class="profile-picture">\n' +
                                        '      <img src="' + (postData.actionperformedbyUserImage ? IMAGE_USER_PATH_LINK + postData.actionperformedbyUserImage : 'images/no-profile-image.jpg') + '" alt="pp">\n' +
                                        '      <p class="name">' + postData.actionperformedbyUser + '</p>\n' +
                                        '      <p class="last-seen">' + formatDate(new Date()) + '</p>\n' +
                                        '   </div>\n' +
                                        '   <div class="request-row">\n' +
                                        '      <strong>' + message + '</strong>\n' +
                                        '   </div>\n' +
                                        '</div>';
                                }
                                break;
                            case "assign_draft":
                                renderHTML += '<div class="message-wrapper reverse ' + (postData.with == "Counterparty" ? "light-gold-color" : "") + '">\n' +
                                    '   <div class="profile-picture">\n' +
                                    '      <img src="' + (postData.actionperformedbyUserImage ? IMAGE_USER_PATH_LINK + postData.actionperformedbyUserImage : 'images/no-profile-image.jpg') + '" alt="pp">\n' +
                                    '      <p class="name">' + postData.actionperformedbyUser + '</p>\n' +
                                    '      <p class="last-seen">' + formatDate(new Date()) + '</p>\n' +
                                    '   </div>\n' +
                                    '   <div class="request-row">\n' +
                                    '      <strong>' + postData.actionperformedbyUser + ' has assigned ' + postData.sendToName + ' to draft this contract section</strong>\n' +
                                    '   </div>\n' +
                                    '</div>\n';
                                getContractDetails(socket, redirection = false);
                                switchClass(elements.btnWithdrawnClauseSameSide, displayNoneClass, true);
                                break;
                            case "draft":
                                var message = '';
                                if (postData.status == 'approved') {
                                    if (postData.chatWindow !== "Our Team") {
                                        document.getElementById('divChatCounterPartyBody').classList.add('contract-completed');
                                        document.getElementById('divChatSameSideBody').classList.add('contract-completed');
                                        document.getElementById('divSameSideTextbox').classList.add(displayNoneClass);
                                        document.getElementById('divCounterpartyTextbox').classList.add(displayNoneClass);
                                        var actionSameSide = document.querySelectorAll('.action-sameside');
                                        actionSameSide.forEach(function (element) {
                                            element.classList.add(displayNoneClass);
                                        });
                                        var actionCounterparty = document.querySelectorAll('.action-counterparty');
                                        actionCounterparty.forEach(function (element) {
                                            element.classList.add(displayNoneClass);
                                        });
                                    }
                                    message = 'Draft confirmation request approved by ' + postData.actionperformedbyUser;
                                } else {
                                    message = 'Draft confirmation request rejected by ' + postData.actionperformedbyUser;

                                    renderHTML += '<div class="message-wrapper reverse red-color">\n' +
                                        '   <div class="profile-picture">\n' +
                                        '      <img src="' + (postData.actionperformedbyUserImage ? IMAGE_USER_PATH_LINK + postData.actionperformedbyUserImage : 'images/no-profile-image.jpg') + '" alt="pp">\n' +
                                        '      <p class="name">' + postData.actionperformedbyUser + '</p>\n' +
                                        '      <p class="last-seen">' + formatDate(new Date()) + '</p>\n' +
                                        '   </div>\n' +
                                        '   <div class="request-row ">\n' +
                                        '      <div class="message-content">\n' +
                                        '         <h4>Draft confirmation rejected</h4>\n' +
                                        '         <div class="message">\n' +
                                        '            <p>' + (postData.message ? postData.message.trim().replaceAll(/\n/g, '<br>') : '') + '</p>\n' +
                                        '         </div>\n' +
                                        '      </div>\n' +
                                        '   </div>\n' +
                                        '</div>';
                                }
                                renderHTML += '<div class="message-wrapper reverse' + (postData.with == "Counterparty" ? " light-gold-color" : "") + '">\n' +
                                    '   <div class="profile-picture">\n' +
                                    '      <img src="' + (postData.actionperformedbyUserImage ? IMAGE_USER_PATH_LINK + postData.actionperformedbyUserImage : 'images/no-profile-image.jpg') + '" alt="pp">\n' +
                                    '      <p class="name">' + postData.actionperformedbyUser + '</p>\n' +
                                    '      <p class="last-seen">' + formatDate(new Date()) + '</p>\n' +
                                    '   </div>\n' +
                                    '   <div class="request-row">\n' +
                                    '      <strong>' + message + '</strong>\n' +
                                    '   </div>\n' +
                                    '</div>\n';
                                getContractSectionDetails();
                                getContractDetails(socket, redirection = false);
                                break;
                            default:
                                renderHTML += '<div class="message-wrapper reverse' + (postData.with == "Counterparty" ? " light-gold-color" : "") + ' ">\n' +
                                    '   <div class="profile-picture">\n' +
                                    '      <img src="' + (postData.actionperformedbyUserImage ? IMAGE_USER_PATH_LINK + postData.actionperformedbyUserImage : 'images/no-profile-image.jpg') + '" alt="pp">\n' +
                                    '      <p class="name">' + postData.actionperformedbyUser + '</p>\n' +
                                    '      <p class="last-seen">' + formatDate(new Date()) + '</p>\n' +
                                    '   </div>\n' +
                                    '   <div class="message-content">\n' +
                                    '      <div class="message">' + (postData.message ? postData.message.trim().replaceAll(/\n/g, '<br>') : '') + '</div>\n' +
                                    '   </div>\n' +
                                    '</div>\n';
                                break
                        }


                        if (postData.messageType == 'Notification' && postData.confirmationType == 'request_draft' && postData.sendTo) {
                            if (postData.with == "Counterparty") {
                                var newElement = document.createElement("div");
                                newElement.innerHTML = renderHTML;
                                elements.conversionSameSide.appendChild(newElement);

                                var scrollToOptions = {
                                    top: elements.divChatSameSideBody.scrollHeight,
                                    behavior: 'smooth'
                                };
                                elements.divChatSameSideBody.scrollTo(scrollToOptions);
                            } else {
                                var newElement = document.createElement("div");
                                newElement.innerHTML = renderHTML;
                                elements.conversionCounterparty.appendChild(newElement);

                                var scrollToOptions = {
                                    top: elements.divChatCounterPartyBody.scrollHeight,
                                    behavior: 'smooth'
                                };
                                elements.divChatCounterPartyBody.scrollTo(scrollToOptions);
                            }
                        } else {
                            if (postData.with == "Counterparty") {
                                var newElement = document.createElement("div");
                                newElement.innerHTML = renderHTML;
                                elements.conversionCounterparty.appendChild(newElement);

                                var scrollToOptions = {
                                    top: elements.divChatCounterPartyBody.scrollHeight,
                                    behavior: 'smooth'
                                };
                                elements.divChatCounterPartyBody.scrollTo(scrollToOptions);
                            } else {
                                var newElement = document.createElement("div");
                                newElement.innerHTML = renderHTML;
                                elements.conversionSameSide.appendChild(newElement);

                                var scrollToOptions = {
                                    top: elements.divChatSameSideBody.scrollHeight,
                                    behavior: 'smooth'
                                };
                                elements.divChatSameSideBody.scrollTo(scrollToOptions);
                            }
                        }
                        closeBottomPopup();

                        // Refresh the contract section lists
                        clauseNextPage = 1;
                        clauseHasNextPage = true;
                        clauseLists = [];
                        getClauses();
                    }
                    switchClass(elements.loader, displayNoneClass, true);
                    return true;
                })
                .catch(error => {
                    // Handle any errors
                    console.log('Error #01041835:', error);
                    switchClass(elements.loader, displayNoneClass, true);
                });
        } catch (error) {
            console.log('Error #01041830:', error);
            switchClass(elements.loader, displayNoneClass, true);
        }
    }

    /**
     * @description This method is used for withdrawn contract section
     * @param postData
     * @param socket
     * @returns {Promise<void>}
     */
    async function withdrawnContractSection(postData, socket) {
        try {
            switchClass(elements.loader, displayNoneClass, false);
            var data = JSON.stringify(postData);
            var requestURL = apiBaseUrl + '/contract-section/withdrawn-contract-section';
            var headers = {
                "Content-Type": "application/json"
            };
            if (authToken) headers["Authorization"] = 'Bearer ' + authToken;
            var requestOptions = {
                method: 'POST',
                headers: headers,
                body: data
            };
            fetch(requestURL, requestOptions)
                .then(response => response.json())
                .then(response => {
                    // Handle the response data
                    if (response && response.status == true && response.code == 200) {
                        // Send same side user
                        socket.emit('contractSectionMessage', postData);

                        // Send conversion history window
                        var generalChatData = postData;
                        var conversationType = 'OTM';
                        generalChatData.chatRoomName = 'conversionHistory_' + selectedThreadID;
                        generalChatData.conversationType = conversationType;
                        socket.emit('conversionHistoryMessage', generalChatData);

                        // Send counter party user
                        var oppositeChat = generalChatData;
                        oppositeChat.with = 'Counterparty';
                        oppositeChat.messageConfirmationFor = 'Opposite Side';
                        oppositeChat.chatRoomName = 'counterparty_' + selectedThreadID;
                        socket.emit('contractSectionMessage', oppositeChat);

                        switchClass(elements.divChatSameSideBody, 'contract-completed', true);
                        switchClass(elements.divChatCounterPartyBody, 'contract-completed', true);
                        switchClass(elements.divSameSideTextbox, displayNoneClass, true);
                        switchClass(elements.divCounterpartyTextbox, displayNoneClass, true);

                        var actionSameSide = document.querySelectorAll('.action-sameside');
                        actionSameSide.forEach(function (element) {
                            element.classList.add(displayNoneClass);
                        });
                        var actionCounterparty = document.querySelectorAll('.action-counterparty');
                        actionCounterparty.forEach(function (element) {
                            element.classList.add(displayNoneClass);
                        });

                        var renderHTML = '';
                        renderHTML += '<div class="chat-typing-area" id="draftConfirmSS">\n' +
                            '   <div class="position-text">This contract section has been withdrawn by ' + postData.actionperformedbyUser + '</div>\n';
                        if (openContractResponseData.userRole == "Admin" || openContractResponseData.userRole == "Contract Creator" || openContractResponseData.userRole == "Counterparty" || openContractResponseData.userRole == "Position Confirmer") {
                            renderHTML += '   <div class="btn-box btn-box-re-open"><button class="btn-primary btn">Re-Open</button></div>\n';
                        }
                        renderHTML += '</div>';
                        var newElement = document.createElement("div");
                        newElement.innerHTML = renderHTML;
                        elements.divChatContractSameSideFooter.appendChild(newElement);

                        var renderHTML = '';
                        renderHTML += '<div class="message-wrapper' + (postData.chatWindow == "Counterparty" ? " light-gold-color" : " reverse") + ' ">\n' +
                            '   <div class="profile-picture">\n' +
                            '      <img src="' + (postData.actionperformedbyUserImage ? IMAGE_USER_PATH_LINK + postData.actionperformedbyUserImage : 'images/no-profile-image.jpg') + '" alt="pp">\n' +
                            '      <p class="name">' + postData.actionperformedbyUser + '</p>\n' +
                            '      <p class="last-seen">' + formatDate(new Date()) + '</p>\n' +
                            '   </div>\n' +
                            '   <div class="request-row">\n' +
                            '      <strong>Contract section withdrawn by ' + postData.actionperformedbyUser + '</strong>\n' +
                            '   </div>\n' +
                            '</div>';
                        if (postData.with == "Counterparty") {
                            var newElement = document.createElement("div");
                            newElement.innerHTML = renderHTML;
                            elements.conversionSameSide.appendChild(newElement);

                            var scrollToOptions = {
                                top: elements.divChatSameSideBody.scrollHeight,
                                behavior: 'smooth'
                            };
                            elements.divChatSameSideBody.scrollTo(scrollToOptions);
                        } else {
                            var newElement = document.createElement("div");
                            newElement.innerHTML = renderHTML;
                            elements.conversionCounterparty.appendChild(newElement);

                            var scrollToOptions = {
                                top: elements.divChatCounterPartyBody.scrollHeight,
                                behavior: 'smooth'
                            };
                            elements.divChatCounterPartyBody.scrollTo(scrollToOptions);
                        }
                        // Refresh the contract section lists
                        clauseNextPage = 1;
                        clauseHasNextPage = true;
                        clauseLists = [];
                        getClauses();
                    }
                    switchClass(elements.loader, displayNoneClass, true);
                })
                .catch(error => {
                    // Handle any errors
                    console.log('Error #01040924:', error);
                    switchClass(elements.loader, displayNoneClass, true);
                });
        } catch (error) {
            console.log('Error #01040923:', error);
            switchClass(elements.loader, displayNoneClass, true);
        }
    }

    /**
     * @description This method is used for the reopen the contract section
     * @param reopenDetail
     * @param socket
     * @returns {Promise<void>}
     */
    async function reOpenContractSection(reopenDetail, socket) {
        try {
            switchClass(elements.loader, displayNoneClass, false);
            var requestURL = apiBaseUrl + '/contract-section/re-open-contract-section/' + reopenDetail.contractSectionId;
            var headers = {
                "Content-Type": "application/json"
            };
            if (authToken) headers["Authorization"] = 'Bearer ' + authToken;
            var requestOptions = {
                method: 'GET',
                headers: headers,
            };
            fetch(requestURL, requestOptions)
                .then(response => response.json())
                .then(response => {
                    // Handle the response data
                    var responseData = response;

                    // Send the message to contract section same side
                    socket.emit('contractSectionMessage', reopenDetail);

                    // Send the message to contract history section
                    var generalChatData = reopenDetail;
                    generalChatData.chatRoomName = 'conversionHistory_' + selectedThreadID;
                    socket.emit('conversionHistoryMessage', generalChatData);

                    var oppositeChat = reopenDetail;
                    // Send the message to contract counterparty side
                    if (reopenDetail.chatWindow !== "Counterparty") {
                        oppositeChat.with = 'Counterparty';
                        oppositeChat.messageConfirmationFor = 'Opposite Side';
                        oppositeChat.chatRoomName = 'counterparty_' + selectedThreadID;
                        socket.emit('contractSectionMessage', oppositeChat);
                    } else {
                        if (counterPartyCompanyDetail) {
                            oppositeChat.with = 'Our Team';
                            oppositeChat.messageConfirmationFor = 'Same Side';
                            oppositeChat.chatRoomName = 'user_' + counterPartyCompanyDetail._id + selectedThreadID;
                            socket.emit('contractSectionMessage', oppositeChat);
                        }
                    }
                    var renderHTML = '';
                    renderHTML += '<div class="message-wrapper' + (reopenDetail.chatWindow == "Counterparty" ? " light-gold-color reverse" : " ") + ' ">\n' +
                        '   <div class="profile-picture">\n' +
                        '      <img src="' + (reopenDetail.actionperformedbyUserImage ? IMAGE_USER_PATH_LINK + reopenDetail.actionperformedbyUserImage : 'images/no-profile-image.jpg') + '" alt="pp">\n' +
                        '      <p class="name">' + reopenDetail.actionperformedbyUser + '</p>\n' +
                        '      <p class="last-seen">' + formatDate(new Date()) + '</p>\n' +
                        '   </div>\n' +
                        '   <div class="request-row">\n' +
                        '      <strong>Contract section Re-Opened by ' + reopenDetail.actionperformedbyUser + '</strong>\n' +
                        '   </div>\n' +
                        '</div>';
                    if (reopenDetail.with == "Counterparty") {
                        var newElement = document.createElement("div");
                        newElement.innerHTML = renderHTML;
                        elements.conversionSameSide.appendChild(newElement);

                        var scrollToOptions = {
                            top: elements.divChatSameSideBody.scrollHeight,
                            behavior: 'smooth'
                        };
                        elements.divChatSameSideBody.scrollTo(scrollToOptions);
                    } else {
                        var newElement = document.createElement("div");
                        newElement.innerHTML = renderHTML;
                        elements.conversionCounterparty.appendChild(newElement);

                        var scrollToOptions = {
                            top: elements.divChatCounterPartyBody.scrollHeight,
                            behavior: 'smooth'
                        };
                        elements.divChatCounterPartyBody.scrollTo(scrollToOptions);
                    }
                    getContractDetails(socket, false);
                    switchClass(elements.loader, displayNoneClass, true);
                })
                .catch(error => {
                    // Handle any errors
                    console.log('Error #02041333:', error);
                    switchClass(elements.loader, displayNoneClass, true);
                });
        } catch (error) {
            console.log('Error #02041331:', error);
            switchClass(elements.loader, displayNoneClass, true);
        }
    }

    /**
     * @description This method is used for the invite user or team in contract section from Sameside window
     * @param socket
     * @param invitationType
     * @returns {Promise<void>}
     */
    async function inviteUsersInContractSection(socket, invitationType) {
        try {
            switchClass(elements.loader, displayNoneClass, false);
            var postData = [];
            var requestURL = apiBaseUrl + '/contract-section/invite-members-contract-section';
            if (invitationType == 'users') {
                inviteUserSelect.forEach((el) => {
                    postData.push(el.itemId)
                });
            } else {
                inviteTeamSelect.forEach((el) => {
                    postData.push(el.itemId)
                });
            }
            var data = JSON.stringify(
                {
                    "contractSectionId": selectedClauseID,
                    "memberType": invitationType == 'users' ? "user" : "team",// team or user
                    "inviteList": postData
                }
            );
            var headers = {
                "Content-Type": "application/json"
            };
            if (authToken) headers["Authorization"] = 'Bearer ' + authToken;
            var requestOptions = {
                method: 'POST',
                headers: headers,
                body: data
            };
            fetch(requestURL, requestOptions)
                .then(response => response.json())
                .then(response => {
                    // Handle the response data
                    var responseData = response;
                    if (invitationType == 'users') {
                        inviteUserSelect.forEach((el) => {
                            var inviteMessage = {
                                "contractId": contractID,
                                "contractSectionId": selectedClauseID,
                                "message": "invited by",
                                "with": withType,
                                "messageType": 'Invite',
                                "companyId": loggedInCompanyDetails._id,
                                "oppositeCompanyId": counterPartyCompanyDetail && counterPartyCompanyDetail._id ? counterPartyCompanyDetail._id : null,
                                "threadID": selectedThreadID,
                                "status": 'None',
                                "actionperformedbyUser": loggedInUserDetails.firstName + " " + loggedInUserDetails.lastName,
                                "actionperformedbyUserImage": loggedInUserDetails.imageKey,
                                "actionperformedbyUserRole": openContractResponseData.userRole,
                                "messageConfirmationFor": messageConfirmationFor,
                                "invitedUserName": el.itemName,
                                "chatRoomName": getChatRoom(withType),
                            };
                            socket.emit('contractSectionMessage', inviteMessage);

                            var generalChatData = inviteMessage;
                            var conversationType = 'OTM';
                            if (loggedInCompanyDetails._id.toString() == contractInformation.companyId.toString() && generalChatData.with == "Our Team") {
                                conversationType = 'OTCC';
                            } else if (loggedInCompanyDetails._id.toString() == contractInformation.counterPartyCompanyId.toString() && generalChatData.with == "Our Team") {
                                conversationType = 'OTCP';
                            }
                            generalChatData.chatRoomName = 'conversionHistory_' + selectedThreadID;
                            generalChatData.conversationType = conversationType;
                            socket.emit('conversionHistoryMessage', generalChatData);

                            var data = {
                                chatRoomName: contractID,
                                usertype: withType
                            };
                            socket.emit('inviteClause', data);

                            var html = '';
                            html += '<strong class="message-wrapper reverse ' + (inviteMessage.with == "Counterparty" ? "light-gold-color" : "") + ' ">\n' +
                                '   <div class="profile-picture">\n' +
                                '      <img src="' + (inviteMessage.actionperformedbyUserImage ? IMAGE_USER_PATH_LINK + inviteMessage.actionperformedbyUserImage : 'images/no-profile-image.jpg') + '" alt="pp">\n' +
                                '      <p class="name">' + inviteMessage.actionperformedbyUser + '</p>\n' +
                                '      <p class="last-seen">' + formatDate(new Date()) + '</p>\n' +
                                '   </div>\n' +
                                '   <strong>\n' + inviteMessage.invitedUserName.trim() + " invited by " + inviteMessage.actionperformedbyUser.trim() + " in this contract section" + '</strong>\n' +
                                '</div>\n';

                            if (inviteMessage.with == "Counterparty") {
                                var newElement = document.createElement("div");
                                newElement.innerHTML = html;
                                elements.conversionCounterparty.appendChild(newElement);

                                var scrollToOptions = {
                                    top: elements.divChatCounterPartyBody.scrollHeight,
                                    behavior: 'smooth'
                                };
                                elements.divChatCounterPartyBody.scrollTo(scrollToOptions);
                            } else {
                                var newElement = document.createElement("div");
                                newElement.innerHTML = html;
                                elements.conversionSameSide.appendChild(newElement);

                                var scrollToOptions = {
                                    top: elements.divChatSameSideBody.scrollHeight,
                                    behavior: 'smooth'
                                };
                                elements.divChatSameSideBody.scrollTo(scrollToOptions);
                            }
                        });
                        // Handle the response data
                        elements.btnOpenInviteUserTeam.closest("li").classList.remove('active');
                        closeBottomPopup();
                        getContractSectionDetails();
                        inviteUserSelect = [];
                    } else {
                        inviteTeamSelect.forEach((el) => {
                            var inviteMessage = {
                                "contractId": contractID,
                                "contractSectionId": selectedClauseID,
                                "message": "invited by",
                                "with": withType,
                                "messageType": 'Invite',
                                "companyId": loggedInCompanyDetails._id,
                                "oppositeCompanyId": counterPartyCompanyDetail && counterPartyCompanyDetail._id ? counterPartyCompanyDetail._id : null,
                                "threadID": selectedThreadID,
                                "status": 'None',
                                "actionperformedbyUser": loggedInUserDetails.firstName + " " + loggedInUserDetails.lastName,
                                "actionperformedbyUserImage": loggedInUserDetails.imageKey,
                                "actionperformedbyUserRole": openContractResponseData.userRole,
                                "messageConfirmationFor": messageConfirmationFor,
                                "invitedTeamName": el.itemName,
                                "chatRoomName": getChatRoom(withType),
                            };
                            socket.emit('contractSectionMessage', inviteMessage);

                            var generalChatData = inviteMessage;
                            var conversationType = 'OTM';
                            if (loggedInCompanyDetails._id.toString() == contractInformation.companyId.toString() && generalChatData.with == "Our Team") {
                                conversationType = 'OTCC';
                            } else if (loggedInCompanyDetails._id.toString() == contractInformation.counterPartyCompanyId.toString() && generalChatData.with == "Our Team") {
                                conversationType = 'OTCP';
                            }
                            generalChatData.chatRoomName = 'conversionHistory_' + selectedThreadID;
                            generalChatData.conversationType = conversationType;
                            socket.emit('conversionHistoryMessage', generalChatData);

                            var html = '';
                            html += '<strong class="message-wrapper reverse ' + (inviteMessage.with == "Counterparty" ? "light-gold-color" : "") + ' ">\n' +
                                '   <div class="profile-picture">\n' +
                                '      <img src="' + (inviteMessage.actionperformedbyUserImage ? IMAGE_USER_PATH_LINK + inviteMessage.actionperformedbyUserImage : 'images/no-profile-image.jpg') + '" alt="pp">\n' +
                                '      <p class="name">' + inviteMessage.actionperformedbyUser + '</p>\n' +
                                '      <p class="last-seen">' + formatDate(new Date()) + '</p>\n' +
                                '   </div>\n' +
                                '   <strong>\n' + inviteMessage.invitedTeamName.trim() + " invited by " + inviteMessage.actionperformedbyUser.trim() + " in this contract section" + '</strong>\n' +
                                '</div>\n';

                            if (inviteMessage.with == "Counterparty") {
                                var newElement = document.createElement("div");
                                newElement.innerHTML = html;
                                elements.conversionCounterparty.appendChild(newElement);

                                var scrollToOptions = {
                                    top: elements.divChatCounterPartyBody.scrollHeight,
                                    behavior: 'smooth'
                                };
                                elements.divChatCounterPartyBody.scrollTo(scrollToOptions);
                            } else {
                                var contentDiv = document.getElementById("chatArea");
                                var newElement = document.createElement("div");
                                newElement.innerHTML = html;
                                elements.conversionSameSide.appendChild(newElement);

                                var scrollToOptions = {
                                    top: elements.divChatSameSideBody.scrollHeight,
                                    behavior: 'smooth'
                                };
                                elements.divChatSameSideBody.scrollTo(scrollToOptions);
                            }
                        });
                        // Handle the response data
                        elements.btnOpenInviteUserTeam.closest("li").classList.remove('active');
                        closeBottomPopup();
                        getContractSectionDetails();
                        inviteTeamSelect = [];
                    }
                    switchClass(elements.loader, displayNoneClass, true);
                })
                .catch(error => {
                    // Handle any errors
                    console.log('Error #01040924:', error);
                    switchClass(elements.loader, displayNoneClass, true);
                });
        } catch (error) {
            console.log('Error #01041607:', error);
            switchClass(elements.loader, displayNoneClass, true);
        }
    }

    /**
     * @description This method is used for the update unread message flag of clause
     * @returns {Promise<void>}
     */
    async function unreadMessageForThread() {
        try {
            switchClass(elements.loader, displayNoneClass, false);
            var data = JSON.stringify({
                contractSectionId: selectedClauseID
            });
            var requestURL = apiBaseUrl + '/contract-section/update-unread-message-status/';
            var headers = {
                "Content-Type": "application/json"
            };
            if (authToken) headers["Authorization"] = 'Bearer ' + authToken;
            var requestOptions = {
                method: 'POST',
                headers: headers,
                body: data
            };
            fetch(requestURL, requestOptions)
                .then(response => response.json())
                .then(data => {
                    // Handle the response data
                    switchClass(elements.loader, displayNoneClass, true);
                    var responseData = data;
                    if (responseData && responseData.status == true && responseData.code == 200) {
                        return true;
                    } else {
                        console.error('Error fetching data:', responseData);
                    }
                    return true;
                })
                .catch(error => {
                    // Handle any errors
                    console.error('Error #04040714:', error);
                    switchClass(elements.loader, displayNoneClass, true);
                });
        } catch (error) {
            console.log('Error #04040707:', error);
            switchClass(elements.loader, displayNoneClass, true);
        }
    }

    /**
     * @description This method is used for the geeting details of meeting
     * @param meetingID
     * @returns {Promise<void>}
     */
    async function getContractMeetingDetails(meetingID) {
        try {
            switchClass(elements.loader, displayNoneClass, false);
            var requestURL = apiBaseUrl + '/meeting/get-contract-meeting-detail/' + meetingID;
            var headers = {
                "Content-Type": "application/json"
            };
            if (authToken) headers["Authorization"] = 'Bearer ' + authToken;
            var requestOptions = {
                method: 'GET',
                headers: headers,
            };
            fetch(requestURL, requestOptions)
                .then(response => response.json())
                .then(response => {
                    // Handle the response data
                    switchClass(elements.loader, displayNoneClass, true);
                    if (response && response.status == true && response.code == 200) {
                        var responseData = response.data;

                        var participantCount = responseData.meetingParticipants ? responseData.meetingParticipants.length : 0

                        switchClass(elements.meetingPopup, displayNoneClass, false);

                        elements.meetingTitle.textContent = responseData.meetingTitle;
                        if (responseData.meetingLocation != null && responseData.meetingLocation != undefined) {
                            elements.meetingLocation.textContent = 'in ' + responseData.meetingLocation;
                        }
                        elements.meetingAgenda.textContent = responseData.meetingAgenda;
                        elements.meetingScheduleTime.textContent = formatDateForMeeting(responseData.meetingDate);
                        elements.MeetingTimings.textContent = responseData.meetingStartTime + " - " + responseData.meetingEndTime;
                        elements.participantCounts.textContent = participantCount;


                        var iHtml = '<ul>';
                        iHtml += '<li>\n' +
                            '\t\t\t\t<div class="meeting-user-item">\n' +
                            '\t\t\t\t\t\t\t\t<div class="left-item">\n' +
                            '\t\t\t\t\t\t\t\t\t\t\t\t<img src="' + (responseData.meetingOrganiser.imageKey ? IMAGE_USER_PATH_LINK + responseData.meetingOrganiser.imageKey : 'images/no-profile-image.jpg') + '" alt="">\n' +
                            '\t\t\t\t\t\t\t\t\t\t\t\t<span>' + responseData.meetingOrganiser.firstName + " " + responseData.meetingOrganiser.lastName + '(Organiser)</span>\n' +
                            '\t\t\t\t\t\t\t\t</div>\n' +
                            '\t\t\t\t</div>\n' +
                            '</li>';
                        responseData.meetingParticipants.forEach((ele) => {
                            if (ele.userId != responseData.meetingOrganiser._id) {
                                var meetingStatus = 'images/pending-icon.svg'
                                if (ele.meetingStatus == 'Accepted') {
                                    meetingStatus = 'images/check-circle.svg'
                                } else if (ele.meetingStatus == 'Decline') {
                                    meetingStatus = 'images/times-circle-icon.svg'
                                } else {
                                    meetingStatus = 'images/pending-icon.svg'
                                }
                                iHtml += '<li>\n' +
                                    '\t\t\t\t<div class="meeting-user-item">\n' +
                                    '\t\t\t\t\t\t\t\t<div class="left-item">\n' +
                                    '\t\t\t\t\t\t\t\t\t\t\t\t<img src="' + (ele.userInfo.imageKey ? IMAGE_USER_PATH_LINK + ele.userInfo.imageKey : 'images/no-profile-image.jpg') + '" alt="">\n' +
                                    '\t\t\t\t\t\t\t\t\t\t\t\t<span>' + ele.userInfo.firstName + " " + ele.userInfo.lastName + '</span>\n' +
                                    '\t\t\t\t\t\t\t\t</div>\n' +
                                    '\t\t\t\t\t\t\t\t<div class="meeting-status">\n' +
                                    '\t\t\t\t\t\t\t\t\t\t\t\t<img src="' + meetingStatus + '" alt="">\n' +
                                    '\t\t\t\t\t\t\t\t</div>\n' +
                                    '\t\t\t\t</div>\n' +
                                    '</li>';
                            }
                        });
                        iHtml += '</ul>';
                        elements.meetingParticipantList.innerHTML = iHtml;
                        if (responseData.meetingOutcomes != null && responseData.meetingOutcomes != undefined && responseData.meetingOutcomes != "") {
                            switchClass(elements.btnMeetingEnterOutcomes, displayNoneClass, true);
                            switchClass(elements.btnMeetingViewOutcomes, displayNoneClass, false);
                            elements.txtMeetingViewOutcomes.innerText = responseData.meetingOutcomes;
                        } else {
                            switchClass(elements.btnMeetingEnterOutcomes, displayNoneClass, false);
                            switchClass(elements.btnMeetingViewOutcomes, displayNoneClass, true);
                        }
                        if (responseData.meetingLink != null && responseData.meetingLink != undefined && responseData.meetingLink != "") {
                            switchClass(elements.btnMeetingView, displayNoneClass, false);
                        } else {
                            switchClass(elements.btnMeetingView, displayNoneClass, true);
                        }
                        return true;
                    } else {
                        console.error('Error fetching data:', responseData);
                    }
                    return true;
                })
                .catch(error => {
                    // Handle any errors
                    console.error('Error #04040714:', error);
                    switchClass(elements.loader, displayNoneClass, true);
                });
        } catch (error) {
            console.log('Error #08040804:', error);
            switchClass(elements.loader, displayNoneClass, true);
        }
    }

    async function submitMeetingOutcomes() {
        switchClass(elements.loader, displayNoneClass, false);
        var form = elements.formMeetingOutcomes;
        const urlencoded = new URLSearchParams();
        urlencoded.append("meetingId", elements.btnMeetingEnterOutcomes.getAttribute('data-id'));
        urlencoded.append("meetingOutcome", form.elements['meetingOutcomes'].value);

        let requestURL = apiBaseUrl + '/meeting/update-meeting-outcome';
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
                console.log('responseData', responseData);
                elements.txtMeetingViewOutcomes.innerText = form.elements['meetingOutcomes'].value;
                switchClass(elements.btnMeetingViewOutcomes, displayNoneClass, false);
                switchClass(elements.divMeetingViewOutcomes, displayNoneClass, false);
                switchClass(elements.btnMeetingEnterOutcomes, displayNoneClass, true);
                switchClass(elements.divMeetingEnterOutcomes, displayNoneClass, true);
                switchClass(elements.loader, displayNoneClass, true);
                elements.formMeetingOutcomes.reset();
            })
            .catch(error => {
                // Handle any errors
                console.log('Error #14031455:', error);
                switchClass(elements.loader, displayNoneClass, true);
            });
    }
    /**================== API End  =========================*/


})(window, undefined);
