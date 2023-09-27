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
    // Declare variables
    var flagInit = false;
    var flagSocketInit = false;
    var flagSocketFunctionInit = false;
    var fClickLabel = false;
    var fDisableWhenPluginLoading = false;
    var flagRedirectFirst = false;
    var flagRedirectClauseCreate = false;
    var flagJSLoad = false;
    var displayNoneClass = "d-none";
    var disabledClass = "disabled";
    var toggleInviteUsersDivShow = true;
    var toggleAssignDraftUsersDivShow = true;
    var toggleAssignDraftRequestUsersDivShow = true;
    var authToken = '';
    var documentID = '';
    var documentMode = '';
    var inviteTeamListIDs = [];
    var inviteUserListIDs = [];
    var selectedInvitedUsers = [];
    var selectedInvitedTeams = [];
    var inviteUserSelect = [];
    var inviteTeamSelect = [];
    var baseUrl = 'https://propact.digitaldilemma.com.au:3000';
    var apiBaseUrl = baseUrl + '/api/v1/app';
    var IMAGE_USER_PATH_LINK = 'https://propact.s3.amazonaws.com/';
    var clauseRecordLimit = 10;
    var clauseNextPage = 1;
    var clauseHasNextPage = true;
    var searchText = '';
    var searchTimeout;
    var tagLists = [];
    var clauseLists = [];
    var selectedCommentThereadID = '';
    var selectedThreadID = '';
    var loggedInUserDetails;
    var typingTimeout;
    var tyingUserSSArray = [];
    var tyingUserCPArray = [];
    var generalChatMessage = [];
    var withType;
    var counterPartyCustomerDetail;
    var messageConfirmationFor;
    var chatRecordLimit = 10;
    var chatNextPage = 1;
    var chatHasNextPage = true;
    var chatHistoryRecordLimit = 10;
    var chatHistoryNextPage = 1;
    var chatHistoryHasNextPage = true;
    var socket = '';
    var openContractUserDetails;
    var selectedContractSectionDetails;
    var sectionID;
    var chatWindows;
    var clauseChatWindows;
    var splitArray;
    var contractCreatorDetails;
    var contractCounterpartyDetails;


    /**================================== Plugin Init Start ===============================*/
    window.Asc.plugin.init = function (text) {

        //event "init" for plugin
        window.Asc.plugin.executeMethod("ShowButton", ["back", false]);
        window.Asc.plugin.executeMethod("GetAllContentControls");
        fBtnGetAll = true;

        /**====================== Get & Set variables ======================*/
        documentID = getDocumentID(window.Asc.plugin.info.documentCallbackUrl);
        documentMode = getDocumentMode(window.Asc.plugin.info.documentCallbackUrl);
        splitArray = window.Asc.plugin.info.documentCallbackUrl.split('/');
        authToken = splitArray[11];
        if (splitArray.length >= 13) {
            sectionID = splitArray[12];
        }
        if (splitArray.length >= 14) {
            chatWindows = splitArray[13];
        }
        /**====================== Get & Set variables ======================*/

        if (!flagSocketInit) {
            socket = io.connect(baseUrl,
                { auth: { authToken } }
            );
            flagSocketInit = true;
        }

        /**
         * @desc If text is not selected or contract is in markup mode than disable the create clause button
         */
        if (documentMode == 'markup') {
            document.getElementById('btnCreateClause').classList.add(displayNoneClass);
            document.getElementById('btnMarkupMode').innerHTML = "Back to Contract";
        } else {
            document.getElementById('btnCreateClause').classList.remove(displayNoneClass);
            document.getElementById('btnCreateClause').classList.add(disabledClass);
            document.getElementById('btnMarkupMode').innerHTML = "Select Markup Mode";
            $('#clauseText').val(text);
            if (text) {
                document.getElementById('btnCreateClause').classList.remove(disabledClass);
            } else {
                if (!document.getElementById('btnCreateClause').classList.contains(disabledClass)) {
                    document.getElementById('btnCreateClause').classList.add(disabledClass);
                }
                /*if (!document.getElementById('divContractCreate').classList.contains(displayNoneClass)) {
                    document.getElementById('divContractCreate').classList.add(displayNoneClass);
                    document.getElementById('divContractLists').classList.remove(displayNoneClass);
                }*/
            }
            if (!fDisableWhenPluginLoading) {
                var sDocumentEditingRestrictions = "readOnly";
                window.Asc.plugin.executeMethod("SetEditingRestrictions", [sDocumentEditingRestrictions]);
                fDisableWhenPluginLoading = true;
            }
        }

        /**
         * @desc Get the open contract and user details
         */
        if (documentID && authToken && !flagInit) {
            getOpenContractUserDetails(socket);
        }

        var varBtnCreateClause = document.getElementById('btnCreateClause');
        varBtnCreateClause.addEventListener('click', function () {
            if (!document.getElementById('inviteUsersBox').classList.contains(displayNoneClass)) {
                document.getElementById('inviteUsersBox').classList.add(displayNoneClass);
                toggleInviteUsersDivShow = false;
            }
            if (text) {
                document.getElementById('divContractLists').classList.add(displayNoneClass);
                document.getElementById('divContractCreate').classList.remove(displayNoneClass);
                toggleInviteUsersDivShow = true;
            }
        });

        if (!flagJSLoad) {

            setInterval(function () {
                checkNewMessageAppear()
            }, 5000);

            document.addEventListener('click', function(e) {
                var divInviteUserTabs = document.getElementById('inviteUserTabs');
                var imgInviteUserTeam = document.getElementById('imgInviteUserTeam');

                if (!divInviteUserTabs.contains(e.target) && e.target !== imgInviteUserTeam) {
                    var toggleInviteUserTeam = document.getElementById('toggleInviteUserTeam');
                    var closestLi = toggleInviteUserTeam.closest('li');
                    if (closestLi) {
                        closestLi.classList.remove('active');
                    }
                }
            });

            // Invite counterparty screen
            var varBtnRedirectInviteCounterpartyForm = document.getElementById('btnRedirectInviteCounterpartyForm');
            varBtnRedirectInviteCounterpartyForm.addEventListener('click', function () {
                document.getElementById('divContractLists').classList.add(displayNoneClass);
                document.getElementById('divInviteCounterparty').classList.add(displayNoneClass);
                document.getElementById('divInviteCounterpartyForm').classList.remove(displayNoneClass);
            });
            // Invite counterparty screen

            // Invite counterparty Form screen
            var varBtnRedirectInviteCounterpartyCancel = document.getElementById('btnRedirectInviteCounterpartyCancel');
            varBtnRedirectInviteCounterpartyCancel.addEventListener('click', function () {
                document.getElementById("inviteForm").reset();
                var apiError = document.getElementsByClassName("api-error");
                for (var i = 0; i < apiError.length; i++) {
                    var label = apiError[i];
                    label.innerHTML = ""; // Remove content
                    label.classList.remove("label"); // Remove class
                }
                document.getElementById('divInviteCounterparty').classList.remove(displayNoneClass);
                document.getElementById('divContractLists').classList.remove(displayNoneClass);
                document.getElementById('divInviteCounterpartyForm').classList.add(displayNoneClass);
            });
            // Invite counterparty Form screen

            // Invite counterparty Pending screen
            var varBtnResendVerification = document.getElementById('btnResendVerification');
            varBtnResendVerification.addEventListener('click', function () {
                document.getElementById('mainLoader').classList.remove(displayNoneClass);
                resendCounterpartyInvitation();
            });

            var varBtnCancelInvitation = document.getElementById('btnCancelInvitation');
            varBtnCancelInvitation.addEventListener('click', function () {
                document.getElementById('mainLoader').classList.remove(displayNoneClass);
                cancelInvitation();
            });
            // Invite counterparty Pending screen

            // Contract clause lists screen
            var varBtnMarkupMode = document.getElementById('btnMarkupMode');
            varBtnMarkupMode.addEventListener('click', function () {
                var data = {
                    chatRoomName: loggedInUserDetails.userWebId + "_" + documentID,
                    documentMode: documentMode == 'markup' ? 'edit' : 'markup'
                }
                socket.emit('switch_document_mode', data);
            });
            // Contract clause lists screen

            // Create contract clause screen
            var varBtnContractCreateClose = document.getElementById('btnContractCreateClose');
            varBtnContractCreateClose.addEventListener('click', function () {
                document.getElementById('clauseForm').reset();
                if ($('#inviteteams').prop('checked')) {
                    $('#inviteteams').click();
                }
                if ($('#inviteusers').prop('checked')) {
                    $('#inviteusers').click();
                }
                var placeholderText = 'Select users and teams';
                document.getElementById('inviteUsersInput').placeholder = placeholderText;
                selectedInvitedTeams = [];
                selectedInvitedUsers = [];
                $('#inviteUsersInput').click();
                $('#collapseTeams, #collapseUsers').collapse('hide');
                document.getElementById('divContractLists').classList.remove(displayNoneClass);
                document.getElementById('divContractCreate').classList.add(displayNoneClass);
            });

            var varBtnContractCreateCancel = document.getElementById('btnContractCreateCancel');
            varBtnContractCreateCancel.addEventListener('click', function () {
                document.getElementById('clauseForm').reset();
                if ($('#inviteteams').prop('checked')) {
                    $('#inviteteams').click();
                }
                if ($('#inviteusers').prop('checked')) {
                    $('#inviteusers').click();
                }
                var placeholderText = 'Select users and teams';
                document.getElementById('inviteUsersInput').placeholder = placeholderText;
                selectedInvitedTeams = [];
                selectedInvitedUsers = [];
                $('#inviteUsersInput').click();
                $('#collapseTeams, #collapseUsers').collapse('hide');
                document.getElementById('divContractLists').classList.remove(displayNoneClass);
                document.getElementById('divContractCreate').classList.add(displayNoneClass);
            });
            // Create contract clause screen

            // Contract chat history screen
            var varBtnRedirectClauseListsA = document.getElementById('btnRedirectClauseListsA');
            varBtnRedirectClauseListsA.addEventListener('click', async function () {
                selectedCommentThereadID = '';
                $('.div-selected').removeClass('div-selected');
                clauseNextPage = 1;
                clauseHasNextPage = true;
                clauseLists = [];
                await getContractSectionList();
                document.getElementById('divContractLists').classList.remove(displayNoneClass);
                document.getElementById('divContractChatHistory').classList.add(displayNoneClass);
                document.getElementById('inviteUserPopup').classList.add(displayNoneClass);
                document.getElementById('inviteTeamPopup').classList.add(displayNoneClass);
                document.getElementById('meetingPopup').classList.add(displayNoneClass);
            });

            var varBtnGoToSameSideChat = document.getElementById('btnGoToSameSideChat');
            varBtnGoToSameSideChat?.addEventListener('click', async function () {
                withType = 'Our Team';
                messageConfirmationFor = 'Same Side';
                document.getElementById('chatArea').innerHTML = '';
                chatNextPage = 1;
                chatHasNextPage = true;
                await getContractSectionMessageList('our');
                var chatRoomName = getChatRoom(withType);
                socket.emit('join_contract_section_chat_room', chatRoomName);
                document.getElementById("messageInput").value = "";
                document.getElementById('divContractSameSideChat').classList.remove(displayNoneClass);
                document.getElementById('divContractCounterpartyChat').classList.add(displayNoneClass);
                document.getElementById('divContractChatHistory').classList.add(displayNoneClass);
            });

            var varBtnGoToCounterparty = document.getElementById('btnGoToCounterparty');
            varBtnGoToCounterparty?.addEventListener('click', async function () {
                withType = 'Counterparty';
                messageConfirmationFor = 'Opposite Side';
                document.getElementById('chatCPArea').innerHTML = '';
                chatNextPage = 1;
                chatHasNextPage = true;
                await getContractSectionMessageList('Counterparty');
                var chatRoomName = getChatRoom(withType);
                socket.emit('join_contract_section_chat_room', chatRoomName);
                document.getElementById("messageInputCP").value = "";
                document.getElementById('divContractCounterpartyChat').classList.remove(displayNoneClass);
                document.getElementById('divContractSameSideChat').classList.add(displayNoneClass);
                document.getElementById('divContractChatHistory').classList.add(displayNoneClass);
            });
            // Contract chat history screen

            // Contract sameside chat screen
            var varMessageInput = document.getElementById('messageInput');
            varMessageInput?.addEventListener('keydown', function () {
                var data = {
                    chatRoomName: getChatRoom(withType),
                    userName: loggedInUserDetails.firstName,
                    with: withType
                }
                user_is_typing_contract_section(socket, data);
            });

            var varMessageInputCP = document.getElementById('messageInputCP');
            varMessageInputCP?.addEventListener('keydown', function () {
                var data = {
                    chatRoomName: getChatRoom(withType),
                    userName: loggedInUserDetails.firstName,
                    with: withType
                }
                user_is_typing_contract_section(socket, data);
            });

            var varInputInviteEmailAddress = document.getElementById('inviteEmailAddress');
            varInputInviteEmailAddress?.addEventListener('keydown', function () {
                var apiError = document.getElementsByClassName("api-error");
                for (var i = 0; i < apiError.length; i++) {
                    var label = apiError[i];
                    label.innerHTML = ""; // Remove content
                    label.classList.remove("label"); // Remove class
                }

            });

            var varBtnGoToConversionHistory = document.getElementById('btnGoToConversionHistory');
            varBtnGoToConversionHistory.addEventListener('click', function () {
                chatHistoryNextPage = 1;
                chatHistoryHasNextPage = true;
                getContractSectionMessageHistory();
                document.getElementById('divContractSameSideChat').classList.add(displayNoneClass);
                document.getElementById('divContractChatHistory').classList.remove(displayNoneClass);
                document.getElementById('inviteUserPopup').classList.add(displayNoneClass);
                document.getElementById('inviteTeamPopup').classList.add(displayNoneClass);
                document.getElementById('sendPositionConfirmationPopup').classList.add(displayNoneClass);
                document.getElementById('reconfirmPositionPopup').classList.add(displayNoneClass);
                document.getElementById('rejectPositionPopup').classList.add(displayNoneClass);
                document.getElementById('assignDraftRequestPopup').classList.add(displayNoneClass);
                document.getElementById('sendDraftConfirmationPopup').classList.add(displayNoneClass);
                document.getElementById('rejectDarftRequestPopup').classList.add(displayNoneClass);
                document.getElementById('rejectDarftPopup').classList.add(displayNoneClass);
            });

            var varBtnGoToConversionHistoryA = document.getElementById('btnGoToConversionHistoryA');
            varBtnGoToConversionHistoryA.addEventListener('click', function () {
                chatHistoryNextPage = 1;
                chatHistoryHasNextPage = true;
                getContractSectionMessageHistory();
                document.getElementById('divContractCounterpartyChat').classList.add(displayNoneClass);
                document.getElementById('divContractChatHistory').classList.remove(displayNoneClass);
                document.getElementById('inviteUserPopup').classList.add(displayNoneClass);
                document.getElementById('inviteTeamPopup').classList.add(displayNoneClass);
                document.getElementById('sendPositionConfirmationPopup').classList.add(displayNoneClass);
                document.getElementById('reconfirmPositionPopup').classList.add(displayNoneClass);
                document.getElementById('rejectPositionPopup').classList.add(displayNoneClass);
                document.getElementById('assignDraftRequestPopup').classList.add(displayNoneClass);
                document.getElementById('sendDraftConfirmationPopup').classList.add(displayNoneClass);
                document.getElementById('rejectDarftRequestPopup').classList.add(displayNoneClass);
                document.getElementById('rejectDarftPopup').classList.add(displayNoneClass);
            });

            var varBtnGoToSameSideA = document.getElementById('btnGoToSameSideA');
            varBtnGoToSameSideA.addEventListener('click', async function () {
                withType = 'Our Team';
                messageConfirmationFor = 'Same Side';
                document.getElementById('chatArea').innerHTML = '';
                chatNextPage = 1;
                chatHasNextPage = true;
                await getContractSectionMessageList('our');
                var chatRoomName = getChatRoom(withType);
                socket.emit('join_contract_section_chat_room', chatRoomName);
                document.getElementById("messageInput").value = "";
                document.getElementById('divContractCounterpartyChat').classList.add(displayNoneClass);
                document.getElementById('divContractSameSideChat').classList.remove(displayNoneClass);
            });

            var varBtnGoToCounterpartyA = document.getElementById('btnGoToCounterpartyA');
            varBtnGoToCounterpartyA.addEventListener('click', async function () {
                withType = 'Counterparty';
                messageConfirmationFor = 'Opposite Side';
                document.getElementById('chatCPArea').innerHTML = '';
                chatNextPage = 1;
                chatHasNextPage = true;
                await getContractSectionMessageList('Counterparty');
                var chatRoomName = getChatRoom(withType);
                socket.emit('join_contract_section_chat_room', chatRoomName);
                document.getElementById("messageInputCP").value = "";
                document.getElementById('divContractCounterpartyChat').classList.remove(displayNoneClass);
                document.getElementById('divContractSameSideChat').classList.add(displayNoneClass);
            });

            var varBtnRedirectClauseListsB = document.getElementById('btnRedirectClauseListsB');
            varBtnRedirectClauseListsB.addEventListener('click', async function () {
                selectedCommentThereadID = '';
                $('.div-selected').removeClass('div-selected');
                clauseNextPage = 1;
                clauseHasNextPage = true;
                clauseLists = [];
                await getContractSectionList();
                document.getElementById('divContractLists').classList.remove(displayNoneClass);
                document.getElementById('divContractSameSideChat').classList.add(displayNoneClass);
                document.getElementById('inviteUserPopup').classList.add(displayNoneClass);
                document.getElementById('inviteTeamPopup').classList.add(displayNoneClass);
                document.getElementById('sendPositionConfirmationPopup').classList.add(displayNoneClass);
                document.getElementById('reconfirmPositionPopup').classList.add(displayNoneClass);
                document.getElementById('rejectPositionPopup').classList.add(displayNoneClass);
                document.getElementById('assignDraftRequestPopup').classList.add(displayNoneClass);
                document.getElementById('sendDraftConfirmationPopup').classList.add(displayNoneClass);
                document.getElementById('rejectDarftRequestPopup').classList.add(displayNoneClass);
                document.getElementById('rejectDarftPopup').classList.add(displayNoneClass);
                document.getElementById('meetingPopup').classList.add(displayNoneClass);
            });

            var varBtnRedirectClauseListsC = document.getElementById('btnRedirectClauseListsC');
            varBtnRedirectClauseListsC.addEventListener('click', async function () {
                selectedCommentThereadID = '';
                $('.div-selected').removeClass('div-selected');
                clauseNextPage = 1;
                clauseHasNextPage = true;
                clauseLists = [];
                await getContractSectionList();
                document.getElementById('divContractLists').classList.remove(displayNoneClass);
                document.getElementById('divContractCounterpartyChat').classList.add(displayNoneClass);
                document.getElementById('inviteUserPopup').classList.add(displayNoneClass);
                document.getElementById('inviteTeamPopup').classList.add(displayNoneClass);
                document.getElementById('sendPositionConfirmationPopup').classList.add(displayNoneClass);
                document.getElementById('reconfirmPositionPopup').classList.add(displayNoneClass);
                document.getElementById('rejectPositionPopup').classList.add(displayNoneClass);
                document.getElementById('assignDraftRequestPopup').classList.add(displayNoneClass);
                document.getElementById('sendDraftConfirmationPopup').classList.add(displayNoneClass);
                document.getElementById('rejectDarftRequestPopup').classList.add(displayNoneClass);
                document.getElementById('rejectDarftPopup').classList.add(displayNoneClass);
                document.getElementById('meetingPopup').classList.add(displayNoneClass);
            });
            // Contract sameside chat screen

            // Toggle inviteuser tabs view
            document.getElementById('inviteUsersInput').addEventListener('click', function () {
                if (toggleInviteUsersDivShow) {
                    document.getElementById('inviteUsersBox').classList.remove(displayNoneClass);
                } else {
                    document.getElementById('inviteUsersBox').classList.add(displayNoneClass);
                }
                toggleInviteUsersDivShow = !toggleInviteUsersDivShow;
            });

            // Clause Lazyload functionality
            document.getElementById('contractListItemsDiv').onscroll = async function (e) {
                if (document.getElementById('contractListItemsDiv').scrollTop + document.getElementById('contractListItemsDiv').offsetHeight >= (document.getElementById('contractListItemsDiv').scrollHeight - 1)) {
                    if (clauseHasNextPage) {
                        await getContractSectionList();
                    }
                }
            };

            // Clause listing screen - Search input
            document.getElementById('inputSearchbox').addEventListener('keyup', function (event) {
                clearTimeout(searchTimeout); // Clear any existing timeout

                // Set a new timeout to call performSearch after 800 milliseconds (adjust as needed)
                searchTimeout = setTimeout(async function () {
                    if (searchText != event.target.value.trim()) {
                        document.getElementById('contractListItemsDiv').innerHTML = '';
                        searchText = event.target.value.trim();
                        clauseNextPage = 1;
                        clauseHasNextPage = true;
                        clauseLists = [];
                        await getContractSectionList();
                    } else {
                        searchText = '';
                        clauseNextPage = 1;
                        clauseHasNextPage = true;
                        clauseLists = [];
                        await getContractSectionList();
                    }
                }, 500);
            });

            $(document).on('click', '#inviteteams', function () {
                $('.team-chkbox').prop('checked', this.checked);
                updateInviteTeamCheckbox();
            });

            $(document).on('click', '.team-chkbox', function () {
                var allChecked = $('.team-chkbox:checked').length === $('.team-chkbox').length;
                $('#inviteteams').prop('checked', allChecked);
                updateInviteTeamCheckbox();
            });

            $(document).on('click', '#inviteusers', function () {
                $('.user-chkbox').prop('checked', this.checked);
                updateInviteUserCheckbox();
            });

            $(document).on('click', '.user-chkbox', function () {
                var allChecked = $('.user-chkbox:checked').length === $('.user-chkbox').length;
                $('#inviteusers').prop('checked', allChecked);
                updateInviteUserCheckbox();
            });

            $(document).on('click', '#inviteusersInModal', function () {
                $('.invite-user-chkbox').prop('checked', this.checked);
                updateInviteUserCheckbox2();
            });

            $(document).on('click', '.invite-user-chkbox', function () {
                var allChecked = $('.invite-user-chkbox:checked').length === $('.invite-user-chkbox').length;
                $('#inviteusersInModal').prop('checked', allChecked);
                updateInviteUserCheckbox2();
            });

            $(document).on('click', '#inviteTeamsInModal', function () {
                $('.invite-team-chkbox').prop('checked', this.checked);
                updateInviteTeamCheckbox2();
            });

            $(document).on('click', '.invite-team-chkbox', function () {
                var allChecked = $('.invite-team-chkbox:checked').length === $('.invite-team-chkbox').length;
                $('#inviteTeamsInModal').prop('checked', allChecked);
                updateInviteTeamCheckbox2();
            });

            $(document).on('click', '#sendToTeamForDraft', function () {
                if (this.checked) {
                    document.getElementById('divDraftingBox').classList.remove(displayNoneClass);
                } else {
                    document.getElementById('divDraftingBox').classList.add(displayNoneClass);
                }
            });

            document.getElementById('assignDraftRequestInputB').addEventListener('click', function () {
                if (toggleAssignDraftRequestUsersDivShow) {
                    document.getElementById('accordionBodyUsersB').innerHTML = '';
                    getContractTeamAndUserList('positionConfirmation');
                    document.getElementById('assignDraftRequestBoxB').classList.remove(displayNoneClass);
                } else {
                    document.getElementById('assignDraftRequestBoxB').classList.add(displayNoneClass);
                }
                toggleAssignDraftRequestUsersDivShow = !toggleAssignDraftRequestUsersDivShow;
            });


            // Toggle inviteuser tabs view
            document.getElementById('assignDraftRequestInput').addEventListener('click', function () {
                if (toggleAssignDraftUsersDivShow) {
                    document.getElementById('accordionBodyUsersA').innerHTML = '';
                    getContractTeamAndUserList('assignDraftRequest');
                    document.getElementById('assignDraftRequestBox').classList.remove(displayNoneClass);
                } else {
                    document.getElementById('assignDraftRequestBox').classList.add(displayNoneClass);
                }
                toggleAssignDraftUsersDivShow = !toggleAssignDraftUsersDivShow;
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
                toggleAssignDraftUsersDivShow = !toggleAssignDraftUsersDivShow;
            });

            function updateAssignDraftRequest(userID, userName) {
                $('#assignDraftRequestUserId').val(userID);
                $('#assignDraftRequestInput').val(userName);
                document.getElementById('assignDraftRequestInput').placeholder = userName;
            }

            $(document).on('click', '.assign-draft-request-user', function () {
                var userID = $(this).data('id');
                var userName = $(this).data('name');
                updateAssignDraftRequestDropdown(userID, userName);
                document.getElementById('sendAssignDraftRequest').disabled = false;
                $('#btncollapseUsersB').toggleClass('active');
                var target = $('#btncollapseUsersB').attr('data-bs-target');
                $(target).collapse('toggle');
                document.getElementById('assignDraftRequestBoxB').classList.add(displayNoneClass);
                toggleAssignDraftRequestUsersDivShow = !toggleAssignDraftRequestUsersDivShow;
            });

            function updateAssignDraftRequestDropdown(userID, userName) {
                $('#assignDraftRequestUserIdB').val(userID);
                $('#assignDraftRequestInputB').val(userName);
                document.getElementById('assignDraftRequestInputB').placeholder = userName;
            }

            $(document).on('click', '.contract-item', async function () {
                fClickLabel = true;
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
                if (tagExists > -1 || 1) {
                    selectedCommentThereadID = $(this).data('commentid');
                    selectedThreadID = $(this).data('id');
                    clauseChatWindows = $(this).data('chatwindow');
                    getSelectedContractSectionDetails();
                    if (!flagRedirectClauseCreate) {
                        getOpenContractUserDetails(socket, redirection = false);
                    }

                    var chatRoomName = 'conversion_history_' + selectedCommentThereadID;
                    socket.emit('join_contract_section_chat_room', chatRoomName);

                    var chatRoomNameA = getChatRoom('Counterparty');
                    socket.emit('join_contract_section_chat_room', chatRoomNameA);

                    var chatRoomNameB = getChatRoom('Our Team');
                    socket.emit('join_contract_section_chat_room', chatRoomNameB);

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
                        withType = 'Our Team';
                        messageConfirmationFor = 'Same Side';
                        document.getElementById('chatArea').innerHTML = '';
                        chatNextPage = 1;
                        chatHasNextPage = true;
                        await getContractSectionMessageList('our');
                        var chatRoomName = getChatRoom(withType);
                        socket.emit('join_contract_section_chat_room', chatRoomName);
                        document.getElementById("messageInput").value = "";
                        document.getElementById('divContractLists').classList.add(displayNoneClass);
                        document.getElementById('divContractSameSideChat').classList.remove(displayNoneClass);
                        document.getElementById('divContractCounterpartyChat').classList.add(displayNoneClass);
                        document.getElementById('divContractChatHistory').classList.add(displayNoneClass);
                    }
                    document.getElementById('sendPositionConfirmationPopup').classList.add(displayNoneClass);
                    document.getElementById('toggleInviteUserTeam').closest("li").classList.remove('active');
                    window.Asc.plugin.executeMethod("SelectContentControl", [tagLists[tagExists].InternalId]);
                    document.getElementById('btnGoToCounterparty').classList.remove(displayNoneClass);
                    document.getElementById('btnGoToCounterpartyA').classList.remove(displayNoneClass);
                    document.getElementById('toggleSendPositionConfirmation').closest("li").classList.remove(displayNoneClass);
                    document.getElementById('toggleSendPositionConfirmationA').closest("li").classList.remove(displayNoneClass);
                    $('#chatFooterInner').removeClass('justify-content-end');
                    if (!openContractUserDetails.canCommunicateWithCounterparty) {
                        document.getElementById('btnGoToCounterparty').classList.add(displayNoneClass);
                        document.getElementById('btnGoToCounterpartyA').classList.add(displayNoneClass);
                        $('#chatFooterInner').addClass('justify-content-end');
                    }
                    if (openContractUserDetails.canSendPositionConfirmation == false) {
                        document.getElementById('toggleSendPositionConfirmation').closest("li").classList.add(displayNoneClass);
                        document.getElementById('toggleSendPositionConfirmationA').closest("li").classList.add(displayNoneClass);
                    }
                    if (openContractUserDetails.openContractDetails.counterPartyInviteStatus != 'Accepted') {
                        document.getElementById('btnGoToCounterparty').classList.add(displayNoneClass);
                        document.getElementById('btnGoToCounterpartyA').classList.add(displayNoneClass);
                        $('#chatFooterInner').addClass('justify-content-end');
                    }
                    var getClauseDetails = clauseLists.find((ele) => ele._id == selectedThreadID);
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
                    }
                    await unreadMessageForThread();
                    flagRedirectClauseCreate = false;
                }
            });

            document.getElementById('chatBodyID').onscroll = (e) => {
                if (document.getElementById('chatBodyID')?.scrollTop == 0 && chatHasNextPage && chatNextPage != 1) {
                    getContractSectionMessageList('our');
                }
            };

            document.getElementById('chatCPBodyID').onscroll = (e) => {
                if (document.getElementById('chatCPBodyID')?.scrollTop == 0 && chatHasNextPage && chatNextPage != 1) {
                    getContractSectionMessageList('Counterparty');
                }
            };

            document.getElementById('chatHistoryBodyID').onscroll = (e) => {
                if (document.getElementById('chatHistoryBodyID')?.scrollTop == 0 && chatHistoryNextPage && chatHistoryNextPage != 1) {
                    getContractSectionMessageHistory();
                }
            };

            var varToggleInviteUserTeam = document.getElementById('toggleInviteUserTeam');
            varToggleInviteUserTeam.addEventListener('click', async function () {
                if (varToggleInviteUserTeam.closest("li").classList.contains('active')) {
                    varToggleInviteUserTeam.closest("li").classList.remove('active');
                } else {
                    getSelectedContractSectionDetails();
                    varToggleInviteUserTeam.closest("li").classList.add('active');
                }
            });

            document.getElementById('btnInviteUsers').addEventListener('click', function () {
                var getClauseDetails = clauseLists.find((ele) => ele._id == selectedThreadID);
                if (getClauseDetails) {
                    var isAllInvited = [];
                    if (loggedInUserDetails.role == 'Counterparty' || loggedInUserDetails.role == 'Contract Creator') {
                        if (inviteUserListIDs.length !== selectedContractSectionDetails.contractAssignedUsers.length) {
                            isAllInvited.push(false);
                        } else {
                            inviteUserListIDs.forEach((el) => {
                                if (!getClauseDetails.assignedUser.includes(el.itemId)) {
                                    isAllInvited.push(false);
                                } else {
                                    isAllInvited.push(true);
                                }
                            });
                        }
                    } else {
                        inviteUserListIDs.forEach((el) => {
                            if (!getClauseDetails.assignedUser.includes(el.itemId)) {
                                isAllInvited.push(false);
                            } else {
                                isAllInvited.push(true);
                            }
                        });
                    }
                    if (inviteUserListIDs && inviteUserListIDs.length == 0) {
                        document.getElementById('allUserInvitedMessage').classList.add(displayNoneClass);
                        document.getElementById('noUserInviteListMessage').classList.remove(displayNoneClass);
                        document.getElementById('partiallyInvitedUserListMessage').classList.add(displayNoneClass);
                        document.getElementById('sendInviteUsers').classList.add(displayNoneClass);
                        document.getElementById('inviteUserTable').classList.add(displayNoneClass);
                    } else if (!isAllInvited.includes(false)) {
                        document.getElementById('allUserInvitedMessage').classList.remove(displayNoneClass);
                        document.getElementById('noUserInviteListMessage').classList.add(displayNoneClass);
                        document.getElementById('partiallyInvitedUserListMessage').classList.add(displayNoneClass);
                        document.getElementById('sendInviteUsers').classList.add(displayNoneClass);
                        document.getElementById('inviteUserTable').classList.add(displayNoneClass);
                    } else {
                        document.getElementById('allUserInvitedMessage').classList.add(displayNoneClass);
                        document.getElementById('noUserInviteListMessage').classList.add(displayNoneClass);
                        document.getElementById('partiallyInvitedUserListMessage').classList.remove(displayNoneClass);
                        document.getElementById('sendInviteUsers').classList.remove(displayNoneClass);
                        document.getElementById('inviteUserTable').classList.remove(displayNoneClass);
                        inviteUserSelect = [];
                        inviteTeamSelect = [];
                        // Render the User Table
                        var iHtml = '<h4>Select User</h4>\n';
                        iHtml += '<div class="table-responsive">\n' +
                            '\t\t\t\t<table class="table table-hover">\n' +
                            '\t\t\t\t\t\t\t\t<thead class="thead-dark">\n' +
                            '\t\t\t\t\t\t\t\t<tr>\n' +
                            '\t\t\t\t\t\t\t\t\t\t\t\t<th scope="col">\n' +
                            '\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div class="form-check"><input type="checkbox" id="inviteusersInModal" class="form-check-input"></div>\n' +
                            '\t\t\t\t\t\t\t\t\t\t\t\t</th>\n' +
                            '\t\t\t\t\t\t\t\t\t\t\t\t<th scope="col">Name</th>\n' +
                            '\t\t\t\t\t\t\t\t\t\t\t\t<th scope="col">Email</th>\n' +
                            '\t\t\t\t\t\t\t\t</tr>\n' +
                            '\t\t\t\t\t\t\t\t</thead>\n' +
                            '\t\t\t\t\t\t\t\t<tbody>\n';
                        inviteUserListIDs.forEach((el) => {
                            // var checkFindIndex = inviteUserListIDs.findIndex((e) => e.itemId == el);
                            if (!getClauseDetails.assignedUser.includes(el.itemId)) {
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
                        document.getElementById('inviteUserTable').innerHTML = '';
                        document.getElementById('inviteUserTable').innerHTML = iHtml;
                    }
                    document.getElementById('inviteUserPopup').classList.remove(displayNoneClass);
                    document.getElementById('inviteTeamPopup').classList.add(displayNoneClass);
                }
            });

            document.getElementById('btnInviteUserTeams').addEventListener('click', function () {
                var getClauseDetails = clauseLists.find((ele) => ele._id == selectedThreadID);
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
                        document.getElementById('allTeamInvitedMessage').classList.add(displayNoneClass);
                        document.getElementById('noTeamInviteListMessage').classList.remove(displayNoneClass);
                        document.getElementById('partiallyInvitedTeamListMessage').classList.add(displayNoneClass);
                        document.getElementById('sendInviteTeams').classList.add(displayNoneClass);
                        document.getElementById('inviteTeamTable').classList.add(displayNoneClass);
                    } else if (!isAllInvited.includes(false)) {
                        document.getElementById('allTeamInvitedMessage').classList.remove(displayNoneClass);
                        document.getElementById('noTeamInviteListMessage').classList.add(displayNoneClass);
                        document.getElementById('partiallyInvitedTeamListMessage').classList.add(displayNoneClass);
                        document.getElementById('sendInviteTeams').classList.add(displayNoneClass);
                        document.getElementById('inviteTeamTable').classList.add(displayNoneClass);
                    } else {
                        document.getElementById('allTeamInvitedMessage').classList.add(displayNoneClass);
                        document.getElementById('noTeamInviteListMessage').classList.add(displayNoneClass);
                        document.getElementById('partiallyInvitedTeamListMessage').classList.remove(displayNoneClass);
                        document.getElementById('sendInviteTeams').classList.remove(displayNoneClass);
                        document.getElementById('inviteTeamTable').classList.remove(displayNoneClass);
                        inviteUserSelect = [];
                        inviteTeamSelect = [];
                        // Render the Team Table
                        var iHtml = '<h4>Select Team</h4>\n';
                        iHtml += '<div class="table-responsive">\n' +
                            '\t\t\t\t<table class="table table-hover">\n' +
                            '\t\t\t\t\t\t\t\t<thead class="thead-dark">\n' +
                            '\t\t\t\t\t\t\t\t<tr>\n' +
                            '\t\t\t\t\t\t\t\t\t\t\t\t<th scope="col">\n' +
                            '\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div class="form-check"><input type="checkbox" id="inviteTeamsInModal" class="form-check-input"></div>\n' +
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
                        document.getElementById('inviteTeamTable').innerHTML = '';
                        document.getElementById('inviteTeamTable').innerHTML = iHtml;
                    }
                    document.getElementById('inviteTeamPopup').classList.remove(displayNoneClass);
                    document.getElementById('inviteUserPopup').classList.add(displayNoneClass);
                }
            });

            document.getElementById('toggleSendPositionConfirmation').addEventListener('click', function () {
                var getClauseDetails = clauseLists.find((ele) => ele._id == selectedThreadID);
                if (openContractUserDetails && openContractUserDetails.openContractDetails && openContractUserDetails.openContractDetails.userWhoHasEditAccess == loggedInUserDetails._id && openContractUserDetails.canSendPositionConfirmation && getClauseDetails.isSectionInDraftMode) {
                    document.getElementById('sendDraftConfirmationPopup').classList.remove(displayNoneClass);
                } else if (openContractUserDetails.canSendPositionConfirmation) {
                    document.getElementById('sendPositionConfirmationPopup').classList.remove(displayNoneClass);
                }
            });

            document.getElementById('toggleSendPositionConfirmationA').addEventListener('click', function () {
                getOpenContractUserDetails(socket, redirection = false);
                var getClauseDetails = clauseLists.find((ele) => ele._id == selectedThreadID);
                if (openContractUserDetails && openContractUserDetails.openContractDetails && openContractUserDetails.canSendPositionConfirmation && getClauseDetails.isSectionInDraftMode) {
                    if (openContractUserDetails.openContractDetails.userWhoHasEditAccess == loggedInUserDetails._id || loggedInUserDetails.role == "Counterparty" || loggedInUserDetails.role == "Contract Creator") {
                        document.getElementById('sendDraftConfirmationPopup').classList.remove(displayNoneClass);
                    } else {
                        document.getElementById('sendPositionConfirmationPopup').classList.remove(displayNoneClass);
                    }
                } else if (openContractUserDetails.canSendPositionConfirmation) {
                    document.getElementById('sendPositionConfirmationPopup').classList.remove(displayNoneClass);
                }
            });

            document.getElementById('toggleScheduleMeeting').addEventListener('click', function () {
                var meetingData = {
                    contractId: documentID,
                    contractSectionId: selectedThreadID,
                    contractSectionThreadId: selectedCommentThereadID,
                    chatRoomName: loggedInUserDetails.userWebId + "_" + documentID
                };
                socket.emit('meeting-schedule', meetingData)
            });

            document.getElementById('toggleScheduleMeetingA').addEventListener('click', function () {
                var meetingData = {
                    contractId: documentID,
                    contractSectionId: selectedThreadID,
                    contractSectionThreadId: selectedCommentThereadID,
                    chatRoomName: loggedInUserDetails.userWebId + "_" + documentID
                };
                socket.emit('meeting-schedule', meetingData)
            });

            document.getElementById('goBackToScreen').addEventListener('click', function () {
                document.getElementById('inviteUserPopup').classList.add(displayNoneClass);
                document.getElementById('inviteTeamPopup').classList.add(displayNoneClass);
            });

            document.getElementById('goBackToScreenA').addEventListener('click', function () {
                document.getElementById('inviteUserPopup').classList.add(displayNoneClass);
                document.getElementById('inviteTeamPopup').classList.add(displayNoneClass);
            });

            document.getElementById('goBackToScreenB').addEventListener('click', function () {
                document.getElementById('frmSendPositionConfirmation').reset();
                document.getElementById('sendPositionConfirmationPopup').classList.add(displayNoneClass);
            });

            document.getElementById('goBackToScreenD').addEventListener('click', function () {
                document.getElementById('frmReconfirmPosition').reset();
                document.getElementById('reconfirmPositionPopup').classList.add(displayNoneClass);
            });

            document.getElementById('goBackToScreenE').addEventListener('click', function () {
                document.getElementById('frmRejectPosition').reset();
                document.getElementById('rejectPositionPopup').classList.add(displayNoneClass);
            });

            document.getElementById('goBackToScreenF').addEventListener('click', function () {
                document.getElementById('frmAssignDraftRequest').reset();
                document.getElementById('assignDraftRequestPopup').classList.add(displayNoneClass);
            });

            document.getElementById('goBackToScreenG').addEventListener('click', function () {
                document.getElementById('frmSendDraftConfirmation').reset();
                document.getElementById('sendDraftConfirmationPopup').classList.add(displayNoneClass);
            });

            document.getElementById('goBackToScreenH').addEventListener('click', function () {
                document.getElementById('frmRejectDraft').reset();
                document.getElementById('rejectDarftPopup').classList.add(displayNoneClass);
            });

            document.getElementById('goBackToScreenI').addEventListener('click', function () {
                document.getElementById('frmRejectDarftRequest').reset();
                document.getElementById('rejectDarftRequestPopup').classList.add(displayNoneClass);
            });

            document.getElementById('sendInviteUsers').addEventListener('click', function () {
                inviteMembersInContractSection(socket);
            });

            document.getElementById('sendInviteTeams').addEventListener('click', function () {
                inviteTeamsInContractSection(socket);
            });

            $(document).on('click', '.reconfirm-approve', function () {
                document.getElementById("frmReconfirmPosition").reset();
                document.getElementById('divDraftingBox').classList.add(displayNoneClass);
                $('#assignDraftRequestUserIdB').val('');
                $('#approvePositionMessageId').val($(this).data('id'));
                document.getElementById('assignDraftRequestInputB').placeholder = "Select user";
                document.getElementById('reconfirmPositionPopup').classList.remove(displayNoneClass);
            });

            $(document).on('click', '.reconfirm-reject', function () {
                $('#rejectPositionMessageId').val($(this).data('id'));
                document.getElementById('rejectPositionPopup').classList.remove(displayNoneClass);
            });

            $(document).on('click', '.assign-user', function () {
                $('#assignDraftRequestMessageId').val($(this).data('id'));
                document.getElementById('assignDraftRequestPopup').classList.remove(displayNoneClass);
            });

            $(document).on('click', '.draft-reject', function () {
                $('#rejectDraftMessageId').val($(this).data('id'));
                document.getElementById('rejectDarftPopup').classList.remove(displayNoneClass);
            });

            $(document).on('click', '.draft-request-reject', function () {
                $('#rejectDraftRequestMessageId').val($(this).data('id'));
                document.getElementById('rejectDarftRequestPopup').classList.remove(displayNoneClass);
            });

            $(document).on('click', '.scheduled-meeting', function () {
                getContractMeetingDetails($(this).data('id'));
                $('#btnMeetingView').attr('data-id', $(this).data('id'));
            });

            $(document).on('click', '.btn-meeting-close', function () {
                document.getElementById('meetingPopup').classList.add(displayNoneClass);
            });

            $(document).on('click', '.btn-meeting-view', function () {
                var meetingData = {
                    meetingId: $(this).data('id'),
                    chatRoomName: loggedInUserDetails.userWebId + "_" + documentID
                };
                socket.emit('scheduled-meeting-view', meetingData)
            });

            /** Invite counterparty form submit */
            $("#inviteForm").validate({
                submitHandler: function (form) {
                    // $(form).ajaxSubmit();
                    document.getElementById('mainLoader').classList.remove(displayNoneClass);
                    inviteCounterparties();
                }
            });

            /** Clause create form submit */
            $("#clauseForm").validate({
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
                errorPlacement: function(error, element) {
                    error.insertAfter(element); // Place error messages after the element
                },
                submitHandler: function (form) {
                    document.getElementById('mainLoader').classList.remove(displayNoneClass);
                    createClauseSection(socket);
                }
            });

            $("#frmSendPositionConfirmation").validate({
                submitHandler: function (form, event) {
                    var sendPositionConfirmation = {
                        "contractId": documentID,
                        "contractSectionId": selectedThreadID,
                        "message": $('#inputSendPositionConfirmation').val(),
                        "with": withType,
                        "messageType": 'Position Confirmation',
                        "companyId": loggedInUserDetails.company._id,
                        "oppositeCompanyId": counterPartyCustomerDetail && counterPartyCustomerDetail.company._id ? counterPartyCustomerDetail.company._id : null,
                        "threadID": selectedCommentThereadID,
                        "status": 'send',
                        "messageStatus": 'None',
                        "actionperformedbyUser": loggedInUserDetails.firstName + " " + loggedInUserDetails.lastName,
                        "actionperformedbyUserImage": loggedInUserDetails.imageUrl,
                        "actionperformedbyUserRole": loggedInUserDetails.role,
                        "actionperformedbyUserId": loggedInUserDetails._id,
                        "messageConfirmationFor": messageConfirmationFor,
                        "chatRoomName": getChatRoom(withType),
                        "messageNumber": 0,
                        "chatWindow": withType
                    };
                    submitPositionConfirmation(sendPositionConfirmation, socket);
                }
            });

            $("#frmRejectPosition").validate({
                submitHandler: function (form) {
                    var rejectConfirmation = {
                        "contractId": documentID,
                        "contractSectionId": selectedThreadID,
                        "message": $('#inputRejectPositionReason').val(),
                        "with": withType,
                        "messageType": 'Notification',
                        "companyId": loggedInUserDetails.company._id,
                        "oppositeCompanyId": counterPartyCustomerDetail && counterPartyCustomerDetail.company._id ? counterPartyCustomerDetail.company._id : null,
                        "threadID": selectedCommentThereadID,
                        "status": 'rejected',
                        "confirmationType": "position",
                        "actionperformedbyUser": loggedInUserDetails.firstName + " " + loggedInUserDetails.lastName,
                        "actionperformedbyUserImage": loggedInUserDetails.imageUrl,
                        "actionperformedbyUserRole": loggedInUserDetails.role,
                        "messageConfirmationFor": messageConfirmationFor,
                        "chatRoomName": getChatRoom(withType),
                        "messageId": $('#rejectPositionMessageId').val(),
                        "messageNumber": 0,
                        "chatWindow": withType
                    };
                    updateContractSectionConfirmationStatus(rejectConfirmation, socket);
                    $('.reconfirm-reject[data-id="' + rejectConfirmation.messageId + '"]').parent().addClass(displayNoneClass);
                }
            });

            $("#frmReconfirmPosition").validate({
                submitHandler: function (form) {
                    var approveConfirmation = {
                        "contractId": documentID,
                        "contractSectionId": selectedThreadID,
                        "message": $('#inputPositionReason').val(),
                        "with": "Counterparty",
                        "messageType": 'Notification',
                        "companyId": loggedInUserDetails.company._id,
                        "oppositeCompanyId": counterPartyCustomerDetail.company._id,
                        "threadID": selectedCommentThereadID,
                        "status": 'approved',
                        "confirmationType": "request_draft",
                        "actionperformedbyUser": loggedInUserDetails.firstName + " " + loggedInUserDetails.lastName,
                        "actionperformedbyUserImage": loggedInUserDetails.imageUrl,
                        "actionperformedbyUserRole": loggedInUserDetails.role,
                        "actionperformedbyUserType": loggedInUserDetails.isCounterPartyCustomer || loggedInUserDetails.isCounterPartyUser ? 'Counterparty' : 'Customer',
                        "messageConfirmationFor": 'Opposite Side',
                        "chatRoomName": getChatRoom('Counterparty'),
                        "messageId": $('#approvePositionMessageId').val(),
                        "messageNumber": 0,
                        "chatWindow": withType
                    };
                    if ($('#assignDraftRequestUserIdB').val() && document.getElementById('sendToTeamForDraft').checked) {
                        approveConfirmation.with = 'Our Team';
                        approveConfirmation.messageConfirmationFor = 'Same Side';
                        approveConfirmation.sendTo = $('#assignDraftRequestUserIdB').val();
                        approveConfirmation.sendToName = document.getElementById('assignDraftRequestInputB').placeholder;
                        approveConfirmation.chatRoomName = 'user_' + counterPartyCustomerDetail.company._id + selectedCommentThereadID
                    }
                    updateContractSectionConfirmationStatus(approveConfirmation, socket, 'frmReconfirmPosition');
                    $('.reconfirm-approve[data-id="' + approveConfirmation.messageId + '"]').parent().addClass(displayNoneClass);
                }
            });

            $("#frmAssignDraftRequest").validate({
                submitHandler: function (form) {
                    var assignDraftRequest = {
                        "contractId": documentID,
                        "contractSectionId": selectedThreadID,
                        "status": "approved",
                        "confirmationType": "assign_draft",
                        "messageType": "Notification",
                        "with": withType,
                        "companyId": loggedInUserDetails.company._id,
                        "oppositeCompanyId": counterPartyCustomerDetail.company._id,
                        "threadID": selectedCommentThereadID,
                        "messageConfirmationFor": messageConfirmationFor,
                        "messageId": $('#assignDraftRequestMessageId').val(),
                        "actionperformedbyUser": loggedInUserDetails.firstName + " " + loggedInUserDetails.lastName,
                        "chatRoomName": getChatRoom(withType),
                        "sendTo": $('#assignDraftRequestUserId').val(),
                        "sendToName": document.getElementById('assignDraftRequestInput').placeholder,
                        "chatWindow": withType
                    };
                    updateContractSectionConfirmationStatus(assignDraftRequest, socket);
                    $('.assign-user[data-id="' + assignDraftRequest.messageId + '"]').parent().addClass(displayNoneClass);
                    document.getElementById('assignDraftRequestInputB').placeholder = "Select user";
                }
            });

            $("#frmSendDraftConfirmation").validate({
                submitHandler: function (form) {
                    var sendDraftConfirmation = {
                        "contractId": documentID,
                        "contractSectionId": selectedThreadID,
                        "message": $('#inputSendDraftConfirmation').val(),
                        "with": withType,
                        "messageType": 'Draft Confirmation',
                        "companyId": loggedInUserDetails.company._id,
                        "oppositeCompanyId": counterPartyCustomerDetail.company._id,
                        "threadID": selectedCommentThereadID,
                        "status": 'send',
                        "messageStatus": 'None',
                        "actionperformedbyUser": loggedInUserDetails.firstName + " " + loggedInUserDetails.lastName,
                        "actionperformedbyUserImage": loggedInUserDetails.imageUrl,
                        "actionperformedbyUserRole": loggedInUserDetails.role,
                        "actionperformedbyUserId": loggedInUserDetails._id,
                        "messageConfirmationFor": messageConfirmationFor,
                        "chatRoomName": getChatRoom(withType),
                        "messageNumber": 0,
                        "chatWindow": withType
                    };
                    submitPositionConfirmation(sendDraftConfirmation, socket);
                }
            });

            $("#frmRejectDraft").validate({
                submitHandler: function (form) {
                    var rejectConfirmation = {
                        "contractId": documentID,
                        "contractSectionId": selectedThreadID,
                        "message": $('#inputRejectDraftReason').val(),
                        "with": withType,
                        "messageType": 'Notification',
                        "companyId": loggedInUserDetails.company._id,
                        "oppositeCompanyId": counterPartyCustomerDetail.company._id,
                        "threadID": selectedCommentThereadID,
                        "status": 'rejected',
                        "confirmationType": "draft",
                        "actionperformedbyUser": loggedInUserDetails.firstName + " " + loggedInUserDetails.lastName,
                        "actionperformedbyUserImage": loggedInUserDetails.imageUrl,
                        "actionperformedbyUserRole": loggedInUserDetails.role,
                        "messageConfirmationFor": messageConfirmationFor,
                        "chatRoomName": getChatRoom(withType),
                        "messageId": $('#rejectDraftMessageId').val(),
                        "messageNumber": 0,
                        "chatWindow": withType
                    };
                    updateContractSectionConfirmationStatus(rejectConfirmation, socket);
                    $('.draft-reject[data-id="' + rejectConfirmation.messageId + '"]').parent().addClass(displayNoneClass);
                }
            });

            $("#frmRejectDarftRequest").validate({
                submitHandler: function (form) {
                    var rejectConfirmation = {
                        "contractId": documentID,
                        "contractSectionId": selectedThreadID,
                        "message": $('#inputRejectDraftRequestReason').val(),
                        "with": withType,
                        "messageType": 'Notification',
                        "companyId": loggedInUserDetails.company._id,
                        "oppositeCompanyId": counterPartyCustomerDetail.company._id,
                        "threadID": selectedCommentThereadID,
                        "status": 'rejected',
                        "confirmationType": "draft_approval",
                        "actionperformedbyUser": loggedInUserDetails.firstName + " " + loggedInUserDetails.lastName,
                        "actionperformedbyUserImage": loggedInUserDetails.imageUrl,
                        "actionperformedbyUserRole": loggedInUserDetails.role,
                        "messageConfirmationFor": messageConfirmationFor,
                        "chatRoomName": getChatRoom(withType),
                        "messageId": $('#rejectDraftRequestMessageId').val(),
                        "messageNumber": 0,
                        "chatWindow": withType
                    };
                    updateContractSectionConfirmationStatus(rejectConfirmation, socket);
                    $('.draft-request-reject[data-id="' + rejectConfirmation.messageId + '"]').parent().addClass(displayNoneClass);
                }
            });

            $(document).on('click', '#btnSend', async function () {
                chat_message = $('#messageInput').val();
                document.getElementById("messageInput").value = "";
                if (chat_message) {
                    var addNewContractMessageDetail = {
                        "contractId": documentID,
                        "contractSectionId": selectedThreadID,
                        "message": chat_message,
                        "with": withType,
                        "messageType": 'Normal',
                        "companyId": loggedInUserDetails.company._id,
                        "oppositeCompanyId": counterPartyCustomerDetail && counterPartyCustomerDetail.company._id ? counterPartyCustomerDetail.company._id : null,
                        "threadID": selectedCommentThereadID,
                        "status": 'send',
                        "actionperformedbyUser": loggedInUserDetails.firstName + " " + loggedInUserDetails.lastName,
                        "actionperformedbyUserImage": loggedInUserDetails.imageUrl,
                        "actionperformedbyUserRole": loggedInUserDetails.role,
                        "messageConfirmationFor": messageConfirmationFor,
                        "chatRoomName": getChatRoom(withType),
                        "messageNumber": 0,
                        "chatWindow": withType
                    };
                    await addContractSectionMessage(addNewContractMessageDetail, socket);
                }
            });

            $(document).on('click', '#btnSendCP', async function () {
                chat_message = $('#messageInputCP').val();
                document.getElementById("messageInputCP").value = "";
                if (chat_message) {
                    var addNewContractMessageDetail = {
                        "contractId": documentID,
                        "contractSectionId": selectedThreadID,
                        "message": chat_message,
                        "with": withType,
                        "messageType": 'Normal',
                        "companyId": loggedInUserDetails.company._id,
                        "oppositeCompanyId": counterPartyCustomerDetail.company._id,
                        "threadID": selectedCommentThereadID,
                        "status": 'send',
                        "actionperformedbyUser": loggedInUserDetails.firstName + " " + loggedInUserDetails.lastName,
                        "actionperformedbyUserImage": loggedInUserDetails.imageUrl,
                        "actionperformedbyUserRole": loggedInUserDetails.role,
                        "messageConfirmationFor": messageConfirmationFor,
                        "chatRoomName": getChatRoom(withType),
                        "messageNumber": 0,
                        "chatWindow": withType
                    };
                    await addContractSectionMessage(addNewContractMessageDetail, socket);
                }
            });

            $(document).on('click', '.approve-possition', function () {
                var approveConfirmation = {
                    "contractId": documentID,
                    "contractSectionId": selectedThreadID,
                    "with": withType,
                    "messageType": 'Notification',
                    "companyId": loggedInUserDetails.company._id,
                    "oppositeCompanyId": counterPartyCustomerDetail && counterPartyCustomerDetail.company._id ? counterPartyCustomerDetail.company._id : null,
                    "threadID": selectedCommentThereadID,
                    "status": 'approved',
                    "confirmationType": "position",
                    "actionperformedbyUser": loggedInUserDetails.firstName + " " + loggedInUserDetails.lastName,
                    "actionperformedbyUserImage": loggedInUserDetails.imageUrl,
                    "actionperformedbyUserRole": loggedInUserDetails.role,
                    "messageConfirmationFor": messageConfirmationFor,
                    "chatRoomName": getChatRoom(withType),
                    "messageId": $(this).data('id'),
                    "messageNumber": 0,
                    "chatWindow": withType
                };
                updateContractSectionConfirmationStatus(approveConfirmation, socket);
                $(this).parent().addClass('d-none');
            });

            $(document).on('click', '.draft-approve', function () {
                var approveDraftConfirmation = {
                    "contractId": documentID,
                    "contractSectionId": selectedThreadID,
                    "with": withType,
                    "messageType": 'Notification',
                    "companyId": loggedInUserDetails.company._id,
                    "oppositeCompanyId": counterPartyCustomerDetail.company._id,
                    "threadID": selectedCommentThereadID,
                    "status": 'approved',
                    "confirmationType": "draft",
                    "actionperformedbyUser": loggedInUserDetails.firstName + " " + loggedInUserDetails.lastName,
                    "actionperformedbyUserImage": loggedInUserDetails.imageUrl,
                    "actionperformedbyUserRole": loggedInUserDetails.role,
                    "messageConfirmationFor": messageConfirmationFor,
                    "chatRoomName": getChatRoom(withType),
                    "messageId": $(this).data('id'),
                    "chatWindow": withType
                };
                updateContractSectionConfirmationStatus(approveDraftConfirmation, socket);
                $(this).parent().addClass('d-none');
            });

            $(document).on('click', '.draft-request-approve', function () {
                var approvedDraftRequest = {
                    "contractId": documentID,
                    "contractSectionId": selectedThreadID,
                    "with": withType,
                    "messageType": 'Notification',
                    "companyId": loggedInUserDetails.company._id,
                    "oppositeCompanyId": counterPartyCustomerDetail.company._id,
                    "threadID": selectedCommentThereadID,
                    "status": 'approved',
                    "confirmationType": "draft_approval",
                    "actionperformedbyUser": loggedInUserDetails.firstName + " " + loggedInUserDetails.lastName,
                    "actionperformedbyUserImage": loggedInUserDetails.imageUrl,
                    "actionperformedbyUserRole": loggedInUserDetails.role,
                    "messageConfirmationFor": messageConfirmationFor,
                    "chatRoomName": getChatRoom(withType),
                    "messageId": $(this).data('id'),
                    "chatWindow": withType
                };
                updateContractSectionConfirmationStatus(approvedDraftRequest, socket);
                $(this).parent().addClass('d-none');
            });

            $(document).on('click', '.btn-box-re-open', function () {
                var reopenDetail = {
                    "contractId": documentID,
                    "contractSectionId": selectedThreadID,
                    "confirmationType": "Reopen",
                    "messageType": 'Notification',
                    "with": withType,
                    "companyId": loggedInUserDetails.company._id,
                    "oppositeCompanyId": counterPartyCustomerDetail.company._id,
                    "threadID": selectedCommentThereadID,
                    "actionperformedbyUser": loggedInUserDetails.firstName + " " + loggedInUserDetails.lastName,
                    "actionperformedbyUserImage": loggedInUserDetails.imageUrl,
                    "actionperformedbyUserRole": loggedInUserDetails.role,
                    "messageConfirmationFor": messageConfirmationFor,
                    "chatRoomName": getChatRoom(withType),
                    "chatWindow": withType
                };
                reOpenCompletedContractSection(reopenDetail, socket);

                document.getElementById('chatBodyID').classList.remove('contract-completed');
                document.getElementById('chatCPBodyID').classList.remove('contract-completed');
                document.getElementById('sameSideTypeBox').classList.remove(displayNoneClass);
                document.getElementById('counterpartyTypeBox').classList.remove(displayNoneClass);
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
            flagJSLoad = true;
        }
    };
    /**================================== Plugin Init End =================================*/

    /**=========================== Plugin onMethodReturn Start ============================*/
    window.Asc.plugin.onMethodReturn = function (returnValue) {
        //event return for completed methods
        var _plugin = window.Asc.plugin;
        if (_plugin.info.methodName == "GetAllContentControls") {
            if (fBtnGetAll) {
                fBtnGetAll = false;
                for (var i = 0; i < returnValue.length; i++) {
                    var tagExists = tagLists.findIndex((ele) => +ele.Id == +returnValue[i].Id);
                    if (tagExists < 0) {
                        tagLists.push(returnValue[i]);
                    }
                }
            } else {
                // document.getElementById("divG").innerHTML = "";
                for (var i = 0; i < returnValue.length; i++) {
                    var tagExists = tagLists.findIndex((ele) => +ele.Id == +returnValue[i].Id);
                    if (tagExists < 0) {
                        tagLists.push(returnValue[i]);
                    }
                }
            }
        } else if (_plugin.info.methodName == "GetCurrentContentControl") {
            if (tagLists && tagLists.length > 0 && returnValue) {
                var selectedTag = tagLists.findIndex((ele) => ele.InternalId == returnValue);
                if (selectedTag && selectedTag > -1 && tagLists[selectedTag].Id && document.getElementById(tagLists[selectedTag].Id)) {
                    selectedCommentThereadID = tagLists[selectedTag].Tag;

                    $('.div-selected').removeClass('div-selected');
                    $('#contractListItemsDiv #' + tagLists[selectedTag].Id).addClass('div-selected');
                }
            }
        }
    };
    /**=========================== Plugin onMethodReturn End ==============================*/

    /**================ Plugin event_onTargetPositionChanged Start ========================*/
    window.Asc.plugin.event_onTargetPositionChanged = function () {
        if (!fClickLabel) {
            window.Asc.plugin.executeMethod("GetCurrentContentControl");
        }
        fClickLabel = false;
    };
    /**================== Plugin event_onTargetPositionChanged End ========================*/

    /**============================== Utils Function Start ================================*/
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
     * Update invite team checkbox
     */
    function updateInviteTeamCheckbox() {
        $('.team-chkbox').each(function () {
            var isChecked = $(this).prop("checked");
            var dataID = $(this).parent().data('id');
            var jsonData = inviteTeamListIDs.find((ele) => ele.itemId == dataID);
            if (isChecked) {
                if (selectedInvitedTeams.findIndex((ele) => ele.itemId == jsonData.itemId) < 0) {
                    selectedInvitedTeams.push(jsonData);
                }
            } else {
                if (selectedInvitedTeams.findIndex((ele) => ele.itemId == jsonData.itemId) > -1) {
                    selectedInvitedTeams = $.grep(selectedInvitedTeams, function (value) {
                        return value.itemId != dataID;
                    });
                }
            }
        })
        updateInviteUsersPlacehoder();
    }

    /**
     * Update invite user checkbox
     */
    function updateInviteUserCheckbox() {
        $('.user-chkbox').each(function () {
            var isChecked = $(this).prop("checked");
            var dataID = $(this).parent().data('id');
            var jsonData = inviteUserListIDs.find((ele) => ele.itemId == dataID);
            if (isChecked) {
                if (selectedInvitedUsers.findIndex((ele) => ele.itemId == jsonData.itemId) < 0) {
                    selectedInvitedUsers.push(jsonData);
                }
            } else {
                if (selectedInvitedUsers.length > 0 && jsonData && selectedInvitedUsers.findIndex((ele) => ele.itemId == jsonData.itemId) > -1) {
                    selectedInvitedUsers = $.grep(selectedInvitedUsers, function (value) {
                        return value.itemId != dataID;
                    });
                }
            }
        });
        updateInviteUsersPlacehoder();
    }

    /**
     * @desc Update the placeholder of Invite user input
     */
    function updateInviteUsersPlacehoder() {
        var placeholderText = 'Select users and teams';
        var placeholderTextArray = [];
        if (selectedInvitedUsers && selectedInvitedUsers.length > 0) {
            placeholderTextArray.push(selectedInvitedUsers.length + (selectedInvitedUsers.length == 1 ? ' User' : ' Users'));
        }
        if (selectedInvitedTeams && selectedInvitedTeams.length > 0) {
            placeholderTextArray.push(selectedInvitedTeams.length + (selectedInvitedTeams.length == 1 ? ' Team' : ' Teams'));
        }
        if (placeholderTextArray.length > 0) {
            placeholderText = placeholderTextArray.join(' and ') + ' Selected';
        }
        document.getElementById('inviteUsersInput').placeholder = placeholderText;
    }

    /**
     * Update invite user checkbox
     */
    function updateInviteUserCheckbox2() {
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
        updateUserInviteButton();
    }

    /**
     * Update invite team checkbox
     */
    function updateInviteTeamCheckbox2() {
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
        updateTeamInviteButton();
    }

    /**
     * @desc Update the invite button enable/disable
     */
    function updateUserInviteButton() {
        var button = document.getElementById("sendInviteUsers");
        if (inviteUserSelect && inviteUserSelect.length > 0) {
            button.disabled = false;
        } else {
            button.disabled = true;
        }
    }

    /**
     * @desc Update the invite button enable/disable
     */
    function updateTeamInviteButton() {
        var button = document.getElementById("sendInviteTeams");
        if (inviteTeamSelect && inviteTeamSelect.length > 0) {
            button.disabled = false;
        } else {
            button.disabled = true;
        }
    }

    /**
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
     * @param withType
     * @returns {string}
     */
    function getChatRoom(withType) {
        return withType == 'Our Team' ? 'user_' + loggedInUserDetails.company._id + selectedCommentThereadID : "counter_" + selectedCommentThereadID;
    }

    socket = io.connect(baseUrl,
        { auth: { authToken } }
    );

    /**
     * @param socket
     * @param data
     */
    function user_is_typing_contract_section(socket, data) {
        socket.emit('user_is_typing_contract_section', data);
    }

    /**
     * setup Socket
     */
    function setupSocket() {
        /**============================== Socket Function Start ===============================*/
        /** Socket Emit: user typing on contract thread */
        if (!flagSocketFunctionInit) {

            var chatRoomName = loggedInUserDetails.userWebId + "_" + documentID;
            socket.emit('join_chat_room', chatRoomName);

            var chatRoomNameA = 'room_' + documentID;
            // console.log('chatRoomNameA', chatRoomNameA);
            socket.emit('join_chat_room', chatRoomNameA);

            var documentChatRoomName = documentID;
            socket.emit('join_chat_room', documentChatRoomName);

            function user_is_typing_contract_section(socket, data) {
                socket.emit('user_is_typing_contract_section', data);
            }

            socket.on('counterparty_invited', data => {
                if (data) {
                    getOpenContractUserDetails(socket, redirection = true);
                }
            });

            /** Socket On: user typing for same side */
            socket.on('user_typing_notification_contract_section', data => {
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
            socket.on('user_typing_notification_counter_contract_section', data => {
                // console.log('user_typing_notification_counter_contract_section', data);
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

            /** Socket On: user message get for same side */
            socket.on('receive_contract_section_message', data => {
                // console.log('receive_contract_section_message', data);
                if (document.getElementById('divContractLists').classList.contains(displayNoneClass)) {
                    unreadMessageForThread()
                }
                var html = '';
                if (data.messageType == "Invite") {
                    if (data.invitedUserName) {
                        html += '<strong class="message-wrapper grey-color">\n' +
                            '   <div class="profile-picture">\n' +
                            '      <img src="' + (data.actionperformedbyUserImage ? data.actionperformedbyUserImage : 'images/no-profile-image.jpg') + '" alt="pp">\n' +
                            '      <p class="name">' + data.actionperformedbyUser + '</p>\n' +
                            '      <p class="last-seen">' + formatDate(new Date()) + '</p>\n' +
                            '   </div>\n' +
                            '   <strong>\n' + data.invitedUserName.trim() + " invited by " + data.actionperformedbyUser.trim() + " in this contract section" + '</strong>\n' +
                            '</div>\n';
                    } else {
                        html += '<strong class="message-wrapper grey-color">\n' +
                            '   <div class="profile-picture">\n' +
                            '      <img src="' + (data.actionperformedbyUserImage ? data.actionperformedbyUserImage : 'images/no-profile-image.jpg') + '" alt="pp">\n' +
                            '      <p class="name">' + data.actionperformedbyUser + '</p>\n' +
                            '      <p class="last-seen">' + formatDate(new Date()) + '</p>\n' +
                            '   </div>\n' +
                            '   <strong>\n' + data.invitedTeamName.trim() + " invited by " + data.actionperformedbyUser.trim() + " in this contract section" + '</strong>\n' +
                            '</div>\n';
                    }
                } else if (data.messageType == 'Position Confirmation') {
                    html += '<div class="message-wrapper grey-color ' + (data && data.messageStatus && data.messageStatus == 'Reject' ? "red-color" : "") + '">\n' +
                        '       <div class="profile-picture">\n' +
                        '           <img src="' + (data.actionperformedbyUserImage ? data.actionperformedbyUserImage : 'images/no-profile-image.jpg') + '" alt="pp">\n' +
                        '           <p class="name">' + data.actionperformedbyUser + '</p>\n' +
                        '           <p class="last-seen">' + formatDate(new Date()) + '</p>\n' +
                        '       </div>\n' +
                        '       <div class="request-row">\n' +
                        '           <div class="request-content">\n' +
                        '               <h4>' + (data.messageStatus == 'None' || data.messageStatus == 'Updated' ? 'Sent a position confirmation <br/> request' : (data.messageStatus == 'Approve' ? 'Position confirmation approved' : 'Position confirmation rejected')) + '</h4>\n' +
                        '               <div class="content-message">' + (data.message ? data.message.trim().replaceAll(/\n/g, '<br>') : '') + '</div>\n' +
                        '           </div>\n';

                    if (data.messageStatus == 'None' && openContractUserDetails.canConfirmPosition) {
                        html += '        <div class="request-btn">\n' +
                            '               <button class="btn btn-primary ' + (data.with != 'Counterparty' ? "approve-possition" : "reconfirm-approve") + '" data-action="Approve" data-id="' + data._id + '" >Approve</button>\n' +
                            '               <button class="btn reject-btn  reconfirm-reject " data-action="Reject"  data-id="' + data._id + '" >Reject</button>\n' +
                            '           </div>\n';
                    }
                    html += '    </div>\n' +
                        '</div>\n';
                } else if (data.messageType == 'Draft Confirmation') {
                    html += '<div class="message-wrapper' + (data.with == "Counterparty" ? " dark-gold-color" : " dudhiya-color") + '">\n' +
                        '   <div class="profile-picture">\n' +
                        '           <img src="' + (data.actionperformedbyUserImage ? data.actionperformedbyUserImage : 'images/no-profile-image.jpg') + '" alt="pp">\n' +
                        '           <p class="name">' + data.actionperformedbyUser + '</p>\n' +
                        '           <p class="last-seen">' + formatDate(new Date()) + '</p>\n' +
                        '   </div>\n' +
                        '   <div class="request-row">\n' +
                        '      <div class="message-content">\n' +
                        '         <h4>Draft confirmation request</h4>\n' +
                        '         <div class="message">' + (data.message ? data.message.trim().replaceAll(/\n/g, '<br>') : '') + '</div>\n' +
                        '      </div>';
                    if (openContractUserDetails.canConfirmPosition) {
                        html += '      <div class="request-btn">\n' +
                            '         <button class="btn btn-primary draft-approve" data-action="Approve" data-id="' + data._id + '">Approve</button>\n' +
                            '         <button class="btn reject-btn  draft-reject " data-action="Reject" data-id="' + data._id + '">Reject</button>\n' +
                            '      </div>';
                    }
                    html += '   </div>\n' +
                        '</div>';
                } else if (data.messageType == 'Notification') {
                    if (data.confirmationType == 'position') {
                        if (data.status == 'rejected') {
                            html += '<div class="message-wrapper red-color">\n' +
                                '       <div class="profile-picture">\n' +
                                '           <img src="' + (data.actionperformedbyUserImage ? data.actionperformedbyUserImage : 'images/no-profile-image.jpg') + '" alt="pp">\n' +
                                '           <p class="name">' + data.actionperformedbyUser + '</p>\n' +
                                '           <p class="last-seen">' + formatDate(new Date()) + '</p>\n' +
                                '       </div>\n' +
                                '       <div class="request-row">\n' +
                                '           <div class="request-content">\n' +
                                '               <h4>Position confirmation rejected</h4>\n' +
                                '               <div class="content-message">' + (data.message ? data.message.trim().replaceAll(/\n/g, '<br>') : '') + '</div>\n' +
                                '           </div>\n' +
                                '       </div>\n' +
                                '</div>';
                            html += '<div class="message-wrapper  ">\n' +
                                '       <div class="profile-picture">\n' +
                                '           <img src="' + (data.actionperformedbyUserImage ? data.actionperformedbyUserImage : 'images/no-profile-image.jpg') + '" alt="pp">\n' +
                                '           <p class="name">' + data.actionperformedbyUser + '</p>\n' +
                                '           <p class="last-seen">' + formatDate(new Date()) + '</p>\n' +
                                '       </div>\n' +
                                '       <div class="request-row">\n' +
                                '           <strong>Position rejected by ' + data.actionperformedbyUser + '</strong>\n' +
                                '       </div>\n' +
                                '</div>'
                        } else {
                            html += '<div class="message-wrapper  ">\n' +
                                '       <div class="profile-picture">\n' +
                                '           <img src="' + (data.actionperformedbyUserImage ? data.actionperformedbyUserImage : 'images/no-profile-image.jpg') + '" alt="pp">\n' +
                                '           <p class="name">' + data.actionperformedbyUser + '</p>\n' +
                                '           <p class="last-seen">' + formatDate(new Date()) + '</p>\n' +
                                '       </div>\n' +
                                '       <div class="request-row">\n' +
                                '           <strong>Position approved by ' + data.actionperformedbyUser + '</strong>\n' +
                                '       </div>\n' +
                                '</div>';
                        }
                    } else if (data.confirmationType == "draft") {
                        if (data.status == 'approved') {
                            html += '<div class="message-wrapper  ">\n' +
                                '       <div class="profile-picture">\n' +
                                '           <img src="' + (data.actionperformedbyUserImage ? data.actionperformedbyUserImage : 'images/no-profile-image.jpg') + '" alt="pp">\n' +
                                '           <p class="name">' + data.actionperformedbyUser + '</p>\n' +
                                '           <p class="last-seen">' + formatDate(new Date()) + '</p>\n' +
                                '       </div>\n' +
                                '       <div class="request-row">\n' +
                                '           <strong>Draft confirmation request approved by ' + data.actionperformedbyUser + '</strong>\n' +
                                '       </div>\n' +
                                '</div>';
                        } else {
                            html += '<div class="message-wrapper red-color">\n' +
                                '       <div class="profile-picture">\n' +
                                '           <img src="' + (data.actionperformedbyUserImage ? data.actionperformedbyUserImage : 'images/no-profile-image.jpg') + '" alt="pp">\n' +
                                '           <p class="name">' + data.actionperformedbyUser + '</p>\n' +
                                '           <p class="last-seen">' + formatDate(new Date()) + '</p>\n' +
                                '       </div>\n' +
                                '       <div class="request-row">\n' +
                                '           <div class="request-content">\n' +
                                '               <h4>Draft confirmation rejected</h4>\n' +
                                '               <div class="content-message">' + (data.message ? data.message.trim().replaceAll(/\n/g, '<br>') : '') + '</div>\n' +
                                '           </div>\n' +
                                '       </div>\n' +
                                '</div>';
                            html += '<div class="message-wrapper  ">\n' +
                                '       <div class="profile-picture">\n' +
                                '           <img src="' + (data.actionperformedbyUserImage ? data.actionperformedbyUserImage : 'images/no-profile-image.jpg') + '" alt="pp">\n' +
                                '           <p class="name">' + data.actionperformedbyUser + '</p>\n' +
                                '           <p class="last-seen">' + formatDate(new Date()) + '</p>\n' +
                                '       </div>\n' +
                                '       <div class="request-row">\n' +
                                '           <strong>Draft confirmation request rejected by ' + data.actionperformedbyUser + '</strong>\n' +
                                '       </div>\n' +
                                '</div>';
                        }
                    } else if (data.confirmationType == "assign_draft") {
                        html += '<div class="message-wrapper  ">\n' +
                            '       <div class="profile-picture">\n' +
                            '           <img src="' + (data.actionperformedbyUserImage ? data.actionperformedbyUserImage : 'images/no-profile-image.jpg') + '" alt="pp">\n' +
                            '           <p class="name">' + data.actionperformedbyUser + '</p>\n' +
                            '           <p class="last-seen">' + formatDate(new Date()) + '</p>\n' +
                            '       </div>\n' +
                            '       <div class="request-row">\n' +
                            '           <strong>' + data.actionperformedbyUser + ' has assigned ' + data.sendToName + ' to draft this contract section</strong>\n' +
                            '       </div>\n' +
                            '</div>';
                        if (loggedInUserDetails._id == data.sendTo) {
                            getOpenContractUserDetails(socket, redirection = false);
                        }
                    } else if (data.confirmationType == "Reopen") {
                        html += '<div class="message-wrapper  ">\n' +
                            '       <div class="profile-picture">\n' +
                            '           <img src="' + (data.actionperformedbyUserImage ? data.actionperformedbyUserImage : 'images/no-profile-image.jpg') + '" alt="pp">\n' +
                            '           <p class="name">' + data.actionperformedbyUser + '</p>\n' +
                            '           <p class="last-seen">' + formatDate(new Date()) + '</p>\n' +
                            '       </div>\n' +
                            '       <div class="request-row">\n' +
                            '           <strong>Contract section Re-Opened ' + data.actionperformedbyUser + '</strong>\n' +
                            '       </div>\n' +
                            '</div>';
                        // getOpenContractUserDetails(socket, redirection = false);
                        document.getElementById('chatBodyID').classList.remove('contract-completed');
                        document.getElementById('chatCPBodyID').classList.remove('contract-completed');
                        document.getElementById('sameSideTypeBox').classList.remove(displayNoneClass);
                        document.getElementById('counterpartyTypeBox').classList.remove(displayNoneClass);
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
                    }
                } else if (data.messageType == "Meeting") {
                    html += '<div class="scheduled-meeting" data-id="' + data.meetingId + '">\n' +
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
                } else {
                    html += '<div class="message-wrapper grey-color">\n' +
                        '   <div class="profile-picture">\n' +
                        '      <img src="' + (data.actionperformedbyUserImage ? data.actionperformedbyUserImage : 'images/no-profile-image.jpg') + '" alt="pp">\n' +
                        '      <p class="name">' + data.actionperformedbyUser + '</p>\n' +
                        '      <p class="last-seen">' + formatDate(new Date()) + '</p>\n' +
                        '   </div>\n' +
                        '   <div class="message-content">\n' +
                        '      <div class="message">' + (data.message ? data.message.trim().replaceAll(/\n/g, '<br>') : '') + '</div>\n' +
                        '   </div>\n' +
                        '</div>\n';
                }
                var contentDiv = document.getElementById("chatArea");
                var newElement = document.createElement("div");
                newElement.innerHTML = html;
                contentDiv.appendChild(newElement);

                var scrollableDiv = document.getElementById('chatBodyID');
                var scrollPositionFromBottom = scrollableDiv.scrollHeight - (scrollableDiv.scrollTop + scrollableDiv.clientHeight)
                if (scrollPositionFromBottom <= 600) {
                    var myDiv = document.getElementById("chatBodyID");
                    var scrollToOptions = {
                        top: myDiv.scrollHeight,
                        behavior: 'smooth'
                    };
                    myDiv.scrollTo(scrollToOptions);
                }
            });

            /** Socket On: user message get for same side */
            socket.on('receive_counter_contract_section_message', data => {
                // console.log('receive_counter_contract_section_message', data);
                if (document.getElementById('divContractLists').classList.contains(displayNoneClass)) {
                    unreadMessageForThread()
                }
                var html = '';
                if (data.messageType == 'Position Confirmation') {
                    html += '<div class="message-wrapper ' + (data.with == "Counterparty" ? "dark-gold-color" : "") + '">\n' +
                        '       <div class="profile-picture">\n' +
                        '           <img src="' + (data.actionperformedbyUserImage ? data.actionperformedbyUserImage : 'images/no-profile-image.jpg') + '" alt="pp">\n' +
                        '           <p class="name">' + data.actionperformedbyUser + '</p>\n' +
                        '           <p class="last-seen">' + formatDate(new Date()) + '</p>\n' +
                        '       </div>\n' +
                        '       <div class="request-row">\n' +
                        '           <div class="message-content">\n' +
                        '               <h4>' + (data.messageStatus == 'None' || data.messageStatus == 'Updated' ? 'Sent a position confirmation <br/> request' : (data.messageStatus == 'Approve' ? 'Position confirmation approved' : 'Position confirmation rejected')) + '</h4>\n' +
                        '               <div class="message">' + (data.message ? data.message.trim().replaceAll(/\n/g, '<br>') : '') + '</div>\n' +
                        '           </div>\n';

                    if (data.messageStatus == 'None' && openContractUserDetails.canConfirmPosition && data.companyId != loggedInUserDetails.company._id) {
                        html += '        <div class="request-btn">\n' +
                            '               <button class="btn btn-primary ' + (data.with != 'Counterparty' ? "approve-possition" : "reconfirm-approve") + '" data-action="Approve" data-id="' + data._id + '" >Approve</button>\n' +
                            '               <button class="btn reject-btn  reconfirm-reject " data-action="Reject"  data-id="' + data._id + '" >Reject</button>\n' +
                            '           </div>\n';
                    }
                    html += '    </div>\n' +
                        '</div>\n';
                } else if (data.messageType == 'Draft Confirmation') {
                    html += '<div class="message-wrapper ' + (data.with == "Counterparty" ? "dark-gold-color" : "") + '">\n' +
                        '   <div class="profile-picture">\n' +
                        '           <img src="' + (data.actionperformedbyUserImage ? data.actionperformedbyUserImage : 'images/no-profile-image.jpg') + '" alt="pp">\n' +
                        '           <p class="name">' + data.actionperformedbyUser + '</p>\n' +
                        '           <p class="last-seen">' + formatDate(new Date()) + '</p>\n' +
                        '   </div>\n' +
                        '   <div class="request-row">\n' +
                        '      <div class="message-content">\n' +
                        '         <h4>Draft confirmation request</h4>\n' +
                        '         <div class="message">' + (data.message ? data.message.trim().replaceAll(/\n/g, '<br>') : '') + '</div>\n' +
                        '      </div>';
                    if (data.companyId != loggedInUserDetails.company._id && openContractUserDetails.canConfirmPosition) {
                        html += '      <div class="request-btn">\n' +
                            '         <button class="btn btn-primary draft-approve" data-action="Approve" data-id="' + data._id + '">Approve</button>\n' +
                            '         <button class="btn reject-btn  draft-reject " data-action="Reject" data-id="' + data._id + '">Reject</button>\n' +
                            '      </div>';
                    }
                    html += '   </div>\n' +
                        '</div>';
                } else if (data.messageType == "Notification" && data.confirmationType == "position") {
                    if (data.status == 'rejected') {
                        html += '<div class="message-wrapper red-color">\n' +
                            '       <div class="profile-picture">\n' +
                            '           <img src="' + (data.actionperformedbyUserImage ? data.actionperformedbyUserImage : 'images/no-profile-image.jpg') + '" alt="pp">\n' +
                            '           <p class="name">' + data.actionperformedbyUser + '&nbsp;<small>' + (data && data.actionperformedbyUserRole ? data.actionperformedbyUserRole : '') + '</small>' + '</p>\n' +
                            '           <p class="last-seen">' + formatDate(new Date()) + '</p>\n' +
                            '       </div>\n' +
                            '       <div class="request-row">\n' +
                            '           <div class="message-content">\n' +
                            '               <h4>Position confirmation rejected</h4>\n' +
                            '               <div class="message">' + (data.message ? data.message.trim().replaceAll(/\n/g, '<br>') : '') + '</div>\n' +
                            '           </div>\n' +
                            '       </div>\n' +
                            '</div>';
                        html += '<div class="message-wrapper grey-color ' + (data.with == "Counterparty" ? "light-gold-color" : "") + '">\n' +
                            '       <div class="profile-picture">\n' +
                            '           <img src="' + (data.actionperformedbyUserImage ? data.actionperformedbyUserImage : 'images/no-profile-image.jpg') + '" alt="pp">\n' +
                            '           <p class="name">' + data.actionperformedbyUser + '&nbsp;<small>' + (data && data.actionperformedbyUserRole ? data.actionperformedbyUserRole : '') + '</small>' + '</p>\n' +
                            '           <p class="last-seen">' + formatDate(new Date()) + '</p>\n' +
                            '       </div>\n' +
                            '       <div class="request-row">\n' +
                            '           <strong>Position rejected by ' + data.actionperformedbyUser + '</strong>\n' +
                            '       </div>\n' +
                            '</div>';
                        $('.reconfirm-approve[data-id="' + data.messageId + '"]').parent().addClass(displayNoneClass);
                    } else {
                        html += '<div class="message-wrapper grey-color ' + (data.with == "Counterparty" ? "light-gold-color" : "") + '">\n' +
                            '       <div class="profile-picture">\n' +
                            '           <img src="' + (data.actionperformedbyUserImage ? data.actionperformedbyUserImage : 'images/no-profile-image.jpg') + '" alt="pp">\n' +
                            '           <p class="name">' + data.actionperformedbyUser + '&nbsp;<small>' + (data && data.actionperformedbyUserRole ? data.actionperformedbyUserRole : '') + '</small>' + '</p>\n' +
                            '           <p class="last-seen">' + formatDate(new Date()) + '</p>\n' +
                            '       </div>\n' +
                            '       <div class="request-row">\n' +
                            '           <strong>Position approved by ' + data.actionperformedbyUser + '</strong>\n' +
                            '       </div>\n' +
                            '</div>';
                    }
                } else if (data.messageType == "Notification" && data.confirmationType == "draft") {
                    if (data.status == 'approved') {
                        getSelectedContractSectionDetails();
                        getOpenContractUserDetails(socket, redirection = false);
                    } else {
                        html += '<div class="message-wrapper red-color">\n' +
                            '       <div class="profile-picture">\n' +
                            '           <img src="' + (data.actionperformedbyUserImage ? data.actionperformedbyUserImage : 'images/no-profile-image.jpg') + '" alt="pp">\n' +
                            '           <p class="name">' + data.actionperformedbyUser + '&nbsp;<small>' + (data && data.actionperformedbyUserRole ? data.actionperformedbyUserRole : '') + '</small>' + '</p>\n' +
                            '           <p class="last-seen">' + formatDate(new Date()) + '</p>\n' +
                            '       </div>\n' +
                            '       <div class="request-row">\n' +
                            '           <div class="message-content">\n' +
                            '               <h4>Draft confirmation rejected</h4>\n' +
                            '               <div class="message">' + (data.message ? data.message.trim().replaceAll(/\n/g, '<br>') : '') + '</div>\n' +
                            '           </div>\n' +
                            '       </div>\n' +
                            '</div>';
                        html += '<div class="message-wrapper grey-color ' + (data.with == "Counterparty" ? "light-gold-color" : "") + '">\n' +
                            '       <div class="profile-picture">\n' +
                            '           <img src="' + (data.actionperformedbyUserImage ? data.actionperformedbyUserImage : 'images/no-profile-image.jpg') + '" alt="pp">\n' +
                            '           <p class="name">' + data.actionperformedbyUser + '&nbsp;<small>' + (data && data.actionperformedbyUserRole ? data.actionperformedbyUserRole : '') + '</small>' + '</p>\n' +
                            '           <p class="last-seen">' + formatDate(new Date()) + '</p>\n' +
                            '       </div>\n' +
                            '       <div class="request-row">\n' +
                            '           <strong>Draft confirmation request rejected by ' + data.actionperformedbyUser + '</strong>\n' +
                            '       </div>\n' +
                            '</div>';
                        getSelectedContractSectionDetails();
                        getOpenContractUserDetails(socket, redirection = false);
                    }
                } else if (data.messageType == "Notification" && data.confirmationType == "request_draft") {
                    if (data.sendTo) {
                        html += '<div class="message-wrapper grey-color ' + (data.with == "Counterparty" ? "light-gold-color" : "") + '">\n' +
                            '       <div class="profile-picture">\n' +
                            '           <img src="' + (data.actionperformedbyUserImage ? data.actionperformedbyUserImage : 'images/no-profile-image.jpg') + '" alt="pp">\n' +
                            '           <p class="name">' + data.actionperformedbyUser + '</p>\n' +
                            '           <p class="last-seen">' + formatDate(new Date()) + '</p>\n' +
                            '       </div>\n' +
                            '       <div class="request-row">\n' +
                            '           <strong>' + data.actionperformedbyUser + ' has assigned a team member to draft this contract section</strong>\n' +
                            '       </div>\n' +
                            '</div>';
                        if (data.messageConfirmationFor != 'Same Side') {
                            html += '<div class="message-wrapper ' + (data.with == "Counterparty" ? "dark-gold-color" : "") + '">\n' +
                                '       <div class="profile-picture">\n' +
                                '           <img src="' + (data.actionperformedbyUserImage ? data.actionperformedbyUserImage : 'images/no-profile-image.jpg') + '" alt="pp">\n' +
                                '           <p class="name">' + data.actionperformedbyUser + '</p>\n' +
                                '           <p class="last-seen">' + formatDate(new Date()) + '</p>\n' +
                                '       </div>\n' +
                                '       <div class="request-row dudhiya-color">\n' +
                                '           <div class="message-content">\n' +
                                '               <h4>Draft contract request</h4>\n' +
                                '               <div class="message">\n' +
                                '                   <p>Draft Request: ' + (data.message ? data.message.trim().replaceAll(/\n/g, '<br>') : '') + '</p>\n' +
                                '                   <p>Note: ' + data.actionperformedbyUser + ' has requested to give contract draft edit request to ' + data.sendToName + '.</p>\n' +
                                '               </div>\n' +
                                '           </div>';
                            if (data.companyId != loggedInUserDetails.company._id && openContractUserDetails.canConfirmPosition) {
                                html += '<div class="request-btn">\n' +
                                    '   <button class="btn btn-primary draft-request-approve" data-action="Approve" data-id="' + data._id + '">Approve</button>\n' +
                                    '   <button class="btn reject-btn  draft-request-reject " data-action="Reject"  data-id="' + data._id + '">Reject</button>\n' +
                                    '</div>\n';
                            }
                        } else if (data.messageConfirmationFor == 'Same Side' && data.actionperformedbyUserRole == "Counterparty") {
                            html += '<div class="message-wrapper ' + (data.with == "Counterparty" ? "dark-gold-color" : "") + '">\n' +
                                '       <div class="profile-picture">\n' +
                                '           <img src="' + (data.actionperformedbyUserImage ? data.actionperformedbyUserImage : 'images/no-profile-image.jpg') + '" alt="pp">\n' +
                                '           <p class="name">' + data.actionperformedbyUser + '</p>\n' +
                                '           <p class="last-seen">' + formatDate(new Date()) + '</p>\n' +
                                '       </div>\n' +
                                '       <div class="request-row dudhiya-color">\n' +
                                '           <div class="message-content">\n' +
                                '               <h4>Draft contract request</h4>\n' +
                                '               <div class="message">\n' +
                                '                   <p>Draft Request: ' + (data.message ? data.message.trim().replaceAll(/\n/g, '<br>') : '') + '</p>\n' +
                                '                   <p>Note: ' + data.actionperformedbyUser + ' has requested to give contract draft edit request to ' + data.sendToName + '.</p>\n' +
                                '               </div>\n' +
                                '           </div>';
                            if (data.companyId != loggedInUserDetails.company._id && openContractUserDetails.canConfirmPosition) {
                                html += '<div class="request-btn">\n' +
                                    '   <button class="btn btn-primary draft-request-approve" data-action="Approve" data-id="' + data._id + '">Approve</button>\n' +
                                    '   <button class="btn reject-btn  draft-request-reject " data-action="Reject"  data-id="' + data._id + '">Reject</button>\n' +
                                    '</div>\n';
                            }
                        }
                        getOpenContractUserDetails(socket, redirection = false);
                        html += '</div>\n' +
                            '</div>';
                    } else {
                        html += '<div class="message-wrapper dark-gold-color">\n' +
                            '       <div class="profile-picture">\n' +
                            '           <img src="' + (data.actionperformedbyUserImage ? data.actionperformedbyUserImage : 'images/no-profile-image.jpg') + '" alt="pp">\n' +
                            '           <p class="name">' + data.actionperformedbyUser + '</p>\n' +
                            '           <p class="last-seen">' + formatDate(new Date()) + '</p>\n' +
                            '       </div>\n' +
                            '       <div class="request-row">\n' +
                            '           <div class="message-content">\n' +
                            '               <h4>Draft Request</h4>\n' +
                            '               <div class="message">' + (data.message ? data.message.trim().replaceAll(/\n/g, '<br>') : '') + '</div>\n' +
                            '           </div>\n' +
                            '       </div>\n' +
                            '</div>';
                        html += '<div class="message-wrapper dark-gold-color">\n' +
                            '       <div class="profile-picture">\n' +
                            '           <img src="' + (data.actionperformedbyUserImage ? data.actionperformedbyUserImage : 'images/no-profile-image.jpg') + '" alt="pp">\n' +
                            '           <p class="name">' + data.actionperformedbyUser + '</p>\n' +
                            '           <p class="last-seen">' + formatDate(new Date()) + '</p>\n' +
                            '       </div>\n' +
                            '       <div class="request-row">\n' +
                            '           <strong>' + data.actionperformedbyUser + ' has assigned opposite side to draft this contract section</strong>\n' +
                            '       </div>\n' +
                            '</div>';
                    }
                    $('.reconfirm-approve[data-id="' + data.messageId + '"]').parent().addClass(displayNoneClass);
                } else if (data.messageType == "Notification" && data.confirmationType == "draft_approval") {
                    if (data.status == "approved") {
                        html += '<div class="message-wrapper grey-color ' + (data.with == "Counterparty" ? "light-gold-color" : "") + '">\n' +
                            '       <div class="profile-picture">\n' +
                            '           <img src="' + (data.actionperformedbyUserImage ? data.actionperformedbyUserImage : 'images/no-profile-image.jpg') + '" alt="pp">\n' +
                            '           <p class="name">' + data.actionperformedbyUser + '</p>\n' +
                            '           <p class="last-seen">' + formatDate(new Date()) + '</p>\n' +
                            '       </div>\n' +
                            '       <div class="request-row">\n' +
                            '           <strong>Draft contract request approved by ' + data.actionperformedbyUser + '</strong>\n' +
                            '       </div>\n' +
                            '</div>';
                        getOpenContractUserDetails(socket, redirection = false);
                    } else if (data.status == "rejected") {
                        html += '<div class="message-wrapper red-color">\n' +
                            '       <div class="profile-picture">\n' +
                            '           <img src="' + (data.actionperformedbyUserImage ? data.actionperformedbyUserImage : 'images/no-profile-image.jpg') + '" alt="pp">\n' +
                            '           <p class="name">' + data.actionperformedbyUser + '</p>\n' +
                            '           <p class="last-seen">' + formatDate(new Date()) + '</p>\n' +
                            '       </div>\n' +
                            '       <div class="request-row">\n' +
                            '           <div class="message-content">\n' +
                            '               <h4>Draft contract request</h4>\n' +
                            '               <div class="message">\n' +
                            '                   <p>Draft Request: ' + (data.message ? data.message.trim().replaceAll(/\n/g, '<br>') : '') + '</p>\n' +
                            '                   <p>Note: ' + data.actionperformedbyUser + ' has requested to give contract draft edit request to opposite user.</p>\n' +
                            '               </div>\n' +
                            '           </div>\n' +
                            '       </div>\n' +
                            '</div>';
                        html += '<div class="message-wrapper grey-color ' + (data.with == "Counterparty" ? "light-gold-color" : "") + '">\n' +
                            '       <div class="profile-picture">\n' +
                            '           <img src="' + (data.actionperformedbyUserImage ? data.actionperformedbyUserImage : 'images/no-profile-image.jpg') + '" alt="pp">\n' +
                            '           <p class="name">' + data.actionperformedbyUser + '</p>\n' +
                            '           <p class="last-seen">' + formatDate(new Date()) + '</p>\n' +
                            '       </div>\n' +
                            '       <div class="request-row">\n' +
                            '           <strong>Draft contract request rejected by ' + data.actionperformedbyUser + '</strong>\n' +
                            '       </div>\n' +
                            '</div>';
                        getOpenContractUserDetails(socket, redirection = false);
                    }
                    $('.draft-request-approve[data-id="' + data.messageId + '"]').parent().addClass(displayNoneClass);
                } else if (data.messageType == "Notification" && data.confirmationType == "Reopen") {
                    html += '<div class="message-wrapper grey-color ' + (data.actionperformedbyUserRole == "Counterparty" ? "light-gold-color" : "") + '">\n' +
                        '   <div class="profile-picture">\n' +
                        '      <img src="' + (data.actionperformedbyUserImage ? data.actionperformedbyUserImage : 'images/no-profile-image.jpg') + '" alt="pp">\n' +
                        '      <p class="name">' + data.actionperformedbyUser + '</p>\n' +
                        '      <p class="last-seen">' + formatDate(new Date()) + '</p>\n' +
                        '   </div>\n' +
                        '   <div class="message-content">\n' +
                        '      <div class="message">Contract section Re-Opened by ' + data.actionperformedbyUser + '</div>\n' +
                        '   </div>\n' +
                        '</div>\n';
                    document.getElementById('chatBodyID').classList.remove('contract-completed');
                    document.getElementById('chatCPBodyID').classList.remove('contract-completed');
                    document.getElementById('sameSideTypeBox').classList.remove(displayNoneClass);
                    document.getElementById('counterpartyTypeBox').classList.remove(displayNoneClass);
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
                } else if (data.messageType == "Meeting") {
                    html += '<div class="scheduled-meeting" data-id="' + data.meetingId + '">\n' +
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
                } else {
                    html += '<div class="message-wrapper grey-color ' + (data.with == "Counterparty" ? "light-gold-color" : "") + '">\n' +
                        '   <div class="profile-picture">\n' +
                        '      <img src="' + (data.actionperformedbyUserImage ? data.actionperformedbyUserImage : 'images/no-profile-image.jpg') + '" alt="pp">\n' +
                        '      <p class="name">' + data.actionperformedbyUser + '</p>\n' +
                        '      <p class="last-seen">' + formatDate(new Date()) + '</p>\n' +
                        '   </div>\n' +
                        '   <div class="message-content">\n' +
                        '      <div class="message">' + (data.message ? data.message.trim().replaceAll(/\n/g, '<br>') : '') + '</div>\n' +
                        '   </div>\n' +
                        '</div>\n';
                }

                var contentDiv = document.getElementById("chatCPArea");
                var newElement = document.createElement("div");
                newElement.innerHTML = html;
                contentDiv.appendChild(newElement);

                var scrollableDiv = document.getElementById('chatCPBodyID');
                var scrollPositionFromBottom = scrollableDiv.scrollHeight - (scrollableDiv.scrollTop + scrollableDiv.clientHeight)
                if (scrollPositionFromBottom <= 600) {
                    var myDiv = document.getElementById("chatCPBodyID");
                    var scrollToOptions = {
                        top: myDiv.scrollHeight,
                        behavior: 'smooth'
                    };
                    myDiv.scrollTo(scrollToOptions);
                }
            });

            /** Socket On: user message get for conversion history */
            socket.on('receive_conversion_history_message', data => {
                // console.log('receive_conversion_history_message', data);
                if (document.getElementById('divContractLists').classList.contains(displayNoneClass)) {
                    unreadMessageForThread()
                }
                if (loggedInUserDetails.isCounterPartyCustomer == true || loggedInUserDetails.isCounterPartyUser == true) {
                    var conversionTypeArr = ['OTCP'];
                    if (openContractUserDetails && openContractUserDetails.canCommunicateWithCounterparty) {
                        conversionTypeArr.push('OTM');
                    }
                    if (!conversionTypeArr.includes(data.conversationType)) {
                        return false;
                    }
                } else {
                    var conversionTypeArr = ['OTCC'];
                    if (openContractUserDetails && openContractUserDetails.canCommunicateWithCounterparty) {
                        conversionTypeArr.push('OTM');
                    }
                    // console.log('asd', conversionTypeArr.includes(data.conversationType));
                    if (!conversionTypeArr.includes(data.conversationType)) {
                        return false;
                    }
                }
                var htmlHistory = '';
                if (data.chatWindow == 'Counterparty') {
                    if (data.messageType == "Invite") {
                        if (data.invitedUserName) {
                            htmlHistory += '<div class="message-wrapper light-gold-color">\n' +
                                '   <div class="profile-picture">\n' +
                                '      <img src="' + (data.actionperformedbyUserImage ? data.actionperformedbyUserImage : 'images/no-profile-image.jpg') + '" alt="pp">\n' +
                                '      <p class="name">' + data.actionperformedbyUser + '&nbsp;<small>' + (data && data.actionperformedbyUserRole ? data.actionperformedbyUserRole : '') + '</small>' + '</p>\n' +
                                '      <p class="last-seen">' + formatDate(new Date()) + '</p>\n' +
                                '   </div>\n' +
                                '   <strong>' + data.invitedUserName.trim() + " invited by " + data.actionperformedbyUser.trim() + " in this contract section" + '</strong>\n' +
                                '</div>\n';
                        } else {
                            htmlHistory += '<div class="message-wrapper light-gold-color">\n' +
                                '   <div class="profile-picture">\n' +
                                '      <img src="' + (data.actionperformedbyUserImage ? data.actionperformedbyUserImage : 'images/no-profile-image.jpg') + '" alt="pp">\n' +
                                '      <p class="name">' + data.actionperformedbyUser + '&nbsp;<small>' + (data && data.actionperformedbyUserRole ? data.actionperformedbyUserRole : '') + '</small>' + '</p>\n' +
                                '      <p class="last-seen">' + formatDate(new Date()) + '</p>\n' +
                                '   </div>\n' +
                                '   <strong>' + data.invitedTeamName.trim() + " invited by " + data.actionperformedbyUser.trim() + " in this contract section" + '</strong>\n' +
                                '</div>\n';
                        }
                    } else if (data.messageType == "Position Confirmation") {
                        htmlHistory += '<div class="message-wrapper dark-gold-color ">\n' +
                            '   <div class="profile-picture">\n' +
                            '      <img src="' + (data.actionperformedbyUserImage ? data.actionperformedbyUserImage : 'images/no-profile-image.jpg') + '" alt="pp">\n' +
                            '      <p class="name">' + data.actionperformedbyUser + '&nbsp;<small>' + (data && data.actionperformedbyUserRole ? data.actionperformedbyUserRole : '') + '</small>' + '</p>\n' +
                            '      <p class="last-seen">' + formatDate(new Date()) + '</p>\n' +
                            '   </div>\n' +
                            '   <div class="message-content">\n' +
                            '      <h4>Sent a position confirmation <br> request</h4>\n' +
                            '      <div class="message">' + (data.message ? data.message.trim().replaceAll(/\n/g, '<br>') : '') + '</div>\n' +
                            '   </div>\n' +
                            '</div>';
                    } else if (data.messageType == "Notification" && data.confirmationType == "position") {
                        if (data.status == 'rejected') {
                            htmlHistory += '<div class="message-wrapper red-color">\n' +
                                '       <div class="profile-picture">\n' +
                                '           <img src="' + (data.actionperformedbyUserImage ? data.actionperformedbyUserImage : 'images/no-profile-image.jpg') + '" alt="pp">\n' +
                                '           <p class="name">' + data.actionperformedbyUser + '&nbsp;<small>' + (data && data.actionperformedbyUserRole ? data.actionperformedbyUserRole : '') + '</small>' + '</p>\n' +
                                '           <p class="last-seen">' + formatDate(new Date()) + '</p>\n' +
                                '       </div>\n' +
                                '       <div class="request-row">\n' +
                                '           <div class="message-content">\n' +
                                '               <h4>Position confirmation rejected</h4>\n' +
                                '               <div class="message">' + (data.message ? data.message.trim().replaceAll(/\n/g, '<br>') : '') + '</div>\n' +
                                '           </div>\n' +
                                '       </div>\n' +
                                '</div>';
                            htmlHistory += '<div class="message-wrapper dark-gold-color ">\n' +
                                '       <div class="profile-picture">\n' +
                                '           <img src="' + (data.actionperformedbyUserImage ? data.actionperformedbyUserImage : 'images/no-profile-image.jpg') + '" alt="pp">\n' +
                                '           <p class="name">' + data.actionperformedbyUser + '&nbsp;<small>' + (data && data.actionperformedbyUserRole ? data.actionperformedbyUserRole : '') + '</small>' + '</p>\n' +
                                '           <p class="last-seen">' + formatDate(new Date()) + '</p>\n' +
                                '       </div>\n' +
                                '       <div class="request-row">\n' +
                                '           <strong>Position rejected by ' + data.actionperformedbyUser + '</strong>\n' +
                                '       </div>\n' +
                                '</div>';
                        } else {
                            htmlHistory += '<div class="message-wrapper dark-gold-color ">\n' +
                                '       <div class="profile-picture">\n' +
                                '           <img src="' + (data.actionperformedbyUserImage ? data.actionperformedbyUserImage : 'images/no-profile-image.jpg') + '" alt="pp">\n' +
                                '           <p class="name">' + data.actionperformedbyUser + '&nbsp;<small>' + (data && data.actionperformedbyUserRole ? data.actionperformedbyUserRole : '') + '</small>' + '</p>\n' +
                                '           <p class="last-seen">' + formatDate(new Date()) + '</p>\n' +
                                '       </div>\n' +
                                '       <div class="request-row">\n' +
                                '           <strong>Position approved by ' + data.actionperformedbyUser + '</strong>\n' +
                                '       </div>\n' +
                                '</div>';
                        }
                    } else if (data.messageType == "Notification" && data.confirmationType == "request_draft") {
                        if (data.sendTo) {
                            htmlHistory += '<div class="message-wrapper dark-gold-color ">\n' +
                                '       <div class="profile-picture">\n' +
                                '           <img src="' + (data.actionperformedbyUserImage ? data.actionperformedbyUserImage : 'images/no-profile-image.jpg') + '" alt="pp">\n' +
                                '           <p class="name">' + data.actionperformedbyUser + '&nbsp;<small>' + (data && data.actionperformedbyUserRole ? data.actionperformedbyUserRole : '') + '</small>' + '</p>\n' +
                                '           <p class="last-seen">' + formatDate(new Date()) + '</p>\n' +
                                '       </div>\n' +
                                '       <div class="request-row">\n' +
                                '           <strong>' + data.actionperformedbyUser + ' has assigned a team member to draft this contract section</strong>\n' +
                                '       </div>\n' +
                                '</div>';
                            if (data.messageConfirmationFor != 'Same Side') {
                                htmlHistory += '<div class="message-wrapper dark-gold-color">\n' +
                                    '       <div class="profile-picture">\n' +
                                    '           <img src="' + (data.actionperformedbyUserImage ? data.actionperformedbyUserImage : 'images/no-profile-image.jpg') + '" alt="pp">\n' +
                                    '           <p class="name">' + data.actionperformedbyUser + '&nbsp;<small>' + (data && data.actionperformedbyUserRole ? data.actionperformedbyUserRole : '') + '</small>' + '</p>\n' +
                                    '           <p class="last-seen">' + formatDate(new Date()) + '</p>\n' +
                                    '       </div>\n' +
                                    '       <div class="request-row dudhiya-color">\n' +
                                    '           <div class="message-content">\n' +
                                    '               <h4>Draft contract request</h4>\n' +
                                    '               <div class="message">\n ' +
                                    '                   <p>Draft Request: ' + (data.message ? data.message.trim().replaceAll(/\n/g, '<br>') : '') + '</p>\n' +
                                    '                   <p>Note: ' + data.actionperformedbyUser + ' has requested to give contract draft edit request to ' + data.sendToName + '.</p>\n' +
                                    '               </div>\n' +
                                    '           </div>\n' +
                                    '       </div>\n' +
                                    '</div>';
                            }
                            getOpenContractUserDetails(socket, redirection = false);
                        } else {
                            htmlHistory += '<div class="message-wrapper dark-gold-color">\n' +
                                '       <div class="profile-picture">\n' +
                                '           <img src="' + (data.actionperformedbyUserImage ? data.actionperformedbyUserImage : 'images/no-profile-image.jpg') + '" alt="pp">\n' +
                                '           <p class="name">' + data.actionperformedbyUser + '&nbsp;<small>' + (data && data.actionperformedbyUserRole ? data.actionperformedbyUserRole : '') + '</small>' + '</p>\n' +
                                '           <p class="last-seen">' + formatDate(new Date()) + '</p>\n' +
                                '       </div>\n' +
                                '       <div class="request-row">\n' +
                                '           <div class="message-content">\n' +
                                '               <h4>Draft Request</h4>\n' +
                                '               <div class="message">' + (data.message ? data.message.trim().replaceAll(/\n/g, '<br>') : '') + '</div>\n' +
                                '           </div>\n' +
                                '       </div>\n' +
                                '</div>';
                            htmlHistory += '<div class="message-wrapper dark-gold-color ">\n' +
                                '       <div class="profile-picture">\n' +
                                '           <img src="' + (data.actionperformedbyUserImage ? data.actionperformedbyUserImage : 'images/no-profile-image.jpg') + '" alt="pp">\n' +
                                '           <p class="name">' + data.actionperformedbyUser + '&nbsp;<small>' + (data && data.actionperformedbyUserRole ? data.actionperformedbyUserRole : '') + '</small>' + '</p>\n' +
                                '           <p class="last-seen">' + formatDate(new Date()) + '</p>\n' +
                                '       </div>\n' +
                                '       <div class="request-row">\n' +
                                '           <strong>' + data.actionperformedbyUser + ' has assigned opposite side to draft this contract section</strong>\n' +
                                '       </div>\n' +
                                '</div>';
                        }
                    } else if (data.messageType == "Notification" && data.confirmationType == "draft") {
                        htmlHistory += '<div class="message-wrapper red-color">\n' +
                            '       <div class="profile-picture">\n' +
                            '           <img src="' + (data.actionperformedbyUserImage ? data.actionperformedbyUserImage : 'images/no-profile-image.jpg') + '" alt="pp">\n' +
                            '           <p class="name">' + data.actionperformedbyUser + '&nbsp;<small>' + (data && data.actionperformedbyUserRole ? data.actionperformedbyUserRole : '') + '</small>' + '</p>\n' +
                            '           <p class="last-seen">' + formatDate(new Date()) + '</p>\n' +
                            '       </div>\n' +
                            '       <div class="request-row">\n' +
                            '           <div class="message-content">\n' +
                            '               <h4>Draft confirmation rejected</h4>\n' +
                            '               <div class="message">' + (data.message ? data.message.trim().replaceAll(/\n/g, '<br>') : '') + '</div>\n' +
                            '           </div>\n' +
                            '       </div>\n' +
                            '</div>';
                        htmlHistory += '<div class="message-wrapper dark-gold-color ">\n' +
                            '       <div class="profile-picture">\n' +
                            '           <img src="' + (data.actionperformedbyUserImage ? data.actionperformedbyUserImage : 'images/no-profile-image.jpg') + '" alt="pp">\n' +
                            '           <p class="name">' + data.actionperformedbyUser + '&nbsp;<small>' + (data && data.actionperformedbyUserRole ? data.actionperformedbyUserRole : '') + '</small>' + '</p>\n' +
                            '           <p class="last-seen">' + formatDate(new Date()) + '</p>\n' +
                            '       </div>\n' +
                            '       <div class="request-row">\n' +
                            '           <strong>Draft confirmation request rejected by ' + data.actionperformedbyUser + '</strong>\n' +
                            '       </div>\n' +
                            '</div>';
                        getSelectedContractSectionDetails();
                        getOpenContractUserDetails(socket, redirection = false);
                    } else if (data.messageType == "Notification" && data.confirmationType == "draft_approval") {
                        if (data.status == "approved") {
                            htmlHistory += '<div class="message-wrapper grey-color light-gold-color">\n' +
                                '       <div class="profile-picture">\n' +
                                '           <img src="' + (data.actionperformedbyUserImage ? data.actionperformedbyUserImage : 'images/no-profile-image.jpg') + '" alt="pp">\n' +
                                '           <p class="name">' + data.actionperformedbyUser + '&nbsp;<small>' + (data && data.actionperformedbyUserRole ? data.actionperformedbyUserRole : '') + '</small>' + '</p>\n' +
                                '           <p class="last-seen">' + formatDate(new Date()) + '</p>\n' +
                                '       </div>\n' +
                                '       <div class="request-row">\n' +
                                '           <strong>Draft contract request approved by ' + data.actionperformedbyUser + '</strong>\n' +
                                '       </div>\n' +
                                '</div>';
                            getOpenContractUserDetails(socket, redirection = false);
                        }
                    } else if (data.messageType == "Notification" && data.confirmationType == "Reopen") {
                        htmlHistory += '<div class="message-wrapper grey-color light-gold-color">\n' +
                            '       <div class="profile-picture">\n' +
                            '           <img src="' + (data.actionperformedbyUserImage ? data.actionperformedbyUserImage : 'images/no-profile-image.jpg') + '" alt="pp">\n' +
                            '           <p class="name">' + data.actionperformedbyUser + '&nbsp;<small>' + (data && data.actionperformedbyUserRole ? data.actionperformedbyUserRole : '') + '</small>' + '</p>\n' +
                            '           <p class="last-seen">' + formatDate(new Date()) + '</p>\n' +
                            '       </div>\n' +
                            '       <div class="request-row">\n' +
                            '           <strong>Contract section Re-Opened by ' + data.actionperformedbyUser + '</strong>\n' +
                            '       </div>\n' +
                            '</div>';
                        document.getElementById('chatBodyID').classList.remove('contract-completed');
                        document.getElementById('chatCPBodyID').classList.remove('contract-completed');
                        document.getElementById('sameSideTypeBox').classList.remove(displayNoneClass);
                        document.getElementById('counterpartyTypeBox').classList.remove(displayNoneClass);
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
                    } else if (data.messageType == "Draft Confirmation") {
                        htmlHistory += '<div class="message-wrapper dark-gold-color">\n' +
                            '       <div class="profile-picture">\n' +
                            '           <img src="' + (data.actionperformedbyUserImage ? data.actionperformedbyUserImage : 'images/no-profile-image.jpg') + '" alt="pp">\n' +
                            '           <p class="name">' + data.actionperformedbyUser + '&nbsp;<small>' + (data && data.actionperformedbyUserRole ? data.actionperformedbyUserRole : '') + '</small>' + '</p>\n' +
                            '           <p class="last-seen">' + formatDate(new Date()) + '</p>\n' +
                            '       </div>\n' +
                            '       <div class="request-row">\n' +
                            '           <div class="message-content">\n' +
                            '               <h4>Draft confirmation request</h4>\n' +
                            '               <div class="message">' + (data.message ? data.message.trim().replaceAll(/\n/g, '<br>') : '') + '</div>\n' +
                            '           </div>\n' +
                            '       </div>\n' +
                            '</div>';
                    } else {
                        htmlHistory += '<div class="message-wrapper light-gold-color">\n' +
                            '   <div class="profile-picture">\n' +
                            '      <img src="' + (data.actionperformedbyUserImage ? data.actionperformedbyUserImage : 'images/no-profile-image.jpg') + '" alt="pp">\n' +
                            '      <p class="name">' + data.actionperformedbyUser + '&nbsp;<small>' + (data && data.actionperformedbyUserRole ? data.actionperformedbyUserRole : '') + '</small>' + '</p>\n' +
                            '      <p class="last-seen">' + formatDate(new Date()) + '</p>\n' +
                            '   </div>\n' +
                            '   <div class="message-content">\n' +
                            '      <div class="message">' + (data.message ? data.message.trim().replaceAll(/\n/g, '<br>') : '') + '</div>\n' +
                            '   </div>\n' +
                            '</div>\n';
                    }
                } else {
                    if (data.messageType == "Invite") {
                        if (data.invitedUserName) {
                            htmlHistory += '<div class="message-wrapper reverse">\n' +
                                '   <div class="profile-picture">\n' +
                                '      <p class="last-seen">' + formatDate(new Date()) + '</p>\n' +
                                '      <p class="name">' + data.actionperformedbyUser + '&nbsp;<small>' + (data && data.actionperformedbyUserRole ? data.actionperformedbyUserRole : '') + '</small>' + '</p>\n' +
                                '      <img src="' + (data.actionperformedbyUserImage ? data.actionperformedbyUserImage : 'images/no-profile-image.jpg') + '" alt="pp">\n' +
                                '   </div>\n' +
                                '   <strong>' + data.invitedUserName.trim() + " invited by " + data.actionperformedbyUser.trim() + " in this contract section" + '</strong>\n' +
                                '</div>\n';
                        } else {
                            htmlHistory += '<div class="message-wrapper reverse">\n' +
                                '   <div class="profile-picture">\n' +
                                '      <p class="last-seen">' + formatDate(new Date()) + '</p>\n' +
                                '      <p class="name">' + data.actionperformedbyUser + '&nbsp;<small>' + (data && data.actionperformedbyUserRole ? data.actionperformedbyUserRole : '') + '</small>' + '</p>\n' +
                                '      <img src="' + (data.actionperformedbyUserImage ? data.actionperformedbyUserImage : 'images/no-profile-image.jpg') + '" alt="pp">\n' +
                                '   </div>\n' +
                                '   <strong>' + data.invitedTeamName.trim() + " invited by " + data.actionperformedbyUser.trim() + " in this contract section" + '</strong>\n' +
                                '</div>\n';
                        }
                    } else if (data.messageType == "Position Confirmation") {
                        htmlHistory += '<div class="message-wrapper reverse">\n' +
                            '<div class="profile-picture">\n' +
                            '      <p class="last-seen">' + formatDate(new Date()) + '</p>\n' +
                            '      <p class="name">' + data.actionperformedbyUser + '&nbsp;<small>' + (data && data.actionperformedbyUserRole ? data.actionperformedbyUserRole : '') + '</small>' + '</p>\n' +
                            '      <img src="' + (data.actionperformedbyUserImage ? data.actionperformedbyUserImage : 'images/no-profile-image.jpg') + '" alt="pp">\n' +
                            '   </div>\n' +
                            '<div class="request-row">\n' +
                            '           <div class="request-content">\n' +
                            '                <h4>Sent a position confirmation <br> request</h4>' +
                            '                <div class="content-message">' + (data.message ? data.message.trim().replaceAll(/\n/g, '<br>') : '') + '</div>\n' +
                            '       </div>\n' +
                            '    </div>\n' +
                            '</div>';
                    } else if (data.messageType == "Notification" && data.confirmationType == "position") {
                        if (data.status == 'rejected') {
                            htmlHistory += '<div class="message-wrapper reverse red-color">\n' +
                                '   <div class="profile-picture">\n' +
                                '      <p class="last-seen">' + formatDate(new Date()) + '</p>\n' +
                                '      <p class="name">' + data.actionperformedbyUser + '</p>\n' +
                                '      <img src="' + (data.actionperformedbyUserImage ? data.actionperformedbyUserImage : 'images/no-profile-image.jpg') + '" alt="pp">\n' +
                                '   </div>\n' +
                                '   <div class="request-row">\n' +
                                '   <div class="request-content">\n' +
                                '      <h4>Position confirmation rejected</h4>\n' +
                                '      <div class="message">' + (data.message ? data.message.trim().replaceAll(/\n/g, '<br>') : '') + '</div>\n' +
                                '   </div>\n' +
                                '   </div>\n' +
                                '</div>\n';
                            htmlHistory += '<div class="message-wrapper reverse ">\n' +
                                '   <div class="profile-picture">\n' +
                                '      <p class="last-seen">' + formatDate(new Date()) + '</p>\n' +
                                '      <p class="name">' + data.actionperformedbyUser + '</p>\n' +
                                '      <img src="' + (data.actionperformedbyUserImage ? data.actionperformedbyUserImage : 'images/no-profile-image.jpg') + '" alt="pp">\n' +
                                '   </div>\n' +
                                '   <div class="request-row">\n' +
                                '       <strong>Position rejected by ' + data.actionperformedbyUser + '</strong>\n' +
                                '   </div>\n' +
                                '</div>'
                        } else {
                            htmlHistory += '<div class="message-wrapper reverse ">\n' +
                                '   <div class="profile-picture">\n' +
                                '      <p class="last-seen">' + formatDate(new Date()) + '</p>\n' +
                                '      <p class="name">' + data.actionperformedbyUser + '</p>\n' +
                                '      <img src="' + (data.actionperformedbyUserImage ? data.actionperformedbyUserImage : 'images/no-profile-image.jpg') + '" alt="pp">\n' +
                                '   </div>\n' +
                                '   <div class="request-row">\n' +
                                '       <strong>Position approved by ' + data.actionperformedbyUser + '</strong>\n' +
                                '   </div>\n' +
                                '</div>'
                        }
                    } else if (data.messageType == "Notification" && data.confirmationType == "draft") {
                        htmlHistory += '<div class="message-wrapper reverse red-color">\n' +
                            '   <div class="profile-picture">\n' +
                            '      <p class="last-seen">' + formatDate(new Date()) + '</p>\n' +
                            '      <p class="name">' + data.actionperformedbyUser + '</p>\n' +
                            '      <img src="' + (data.actionperformedbyUserImage ? data.actionperformedbyUserImage : 'images/no-profile-image.jpg') + '" alt="pp">\n' +
                            '   </div>\n' +
                            '   <div class="request-row">\n' +
                            '   <div class="request-content">\n' +
                            '      <h4>Draft confirmation rejected</h4>\n' +
                            '      <div class="message">' + (data.message ? data.message.trim().replaceAll(/\n/g, '<br>') : '') + '</div>\n' +
                            '   </div>\n' +
                            '   </div>\n' +
                            '</div>\n';
                        htmlHistory += '<div class="message-wrapper reverse ">\n' +
                            '   <div class="profile-picture">\n' +
                            '      <p class="last-seen">' + formatDate(new Date()) + '</p>\n' +
                            '      <p class="name">' + data.actionperformedbyUser + '</p>\n' +
                            '      <img src="' + (data.actionperformedbyUserImage ? data.actionperformedbyUserImage : 'images/no-profile-image.jpg') + '" alt="pp">\n' +
                            '   </div>\n' +
                            '   <div class="request-row">\n' +
                            '       <strong>Draft confirmation request rejected by ' + data.actionperformedbyUser + '</strong>\n' +
                            '   </div>\n' +
                            '</div>'
                        getSelectedContractSectionDetails();
                        getOpenContractUserDetails(socket, redirection = false);
                    } else if (data.messageType == "Notification" && data.confirmationType == "Reopen") {
                        htmlHistory += '<div class="message-wrapper reverse ">\n' +
                            '       <div class="profile-picture">\n' +
                            '           <img src="' + (data.actionperformedbyUserImage ? data.actionperformedbyUserImage : 'images/no-profile-image.jpg') + '" alt="pp">\n' +
                            '           <p class="name">' + data.actionperformedbyUser + '&nbsp;<small>' + (data && data.actionperformedbyUserRole ? data.actionperformedbyUserRole : '') + '</small>' + '</p>\n' +
                            '           <p class="last-seen">' + formatDate(new Date()) + '</p>\n' +
                            '       </div>\n' +
                            '       <div class="request-row">\n' +
                            '           <strong>Contract section Re-Opened by ' + data.actionperformedbyUser + '</strong>\n' +
                            '       </div>\n' +
                            '</div>';
                        document.getElementById('chatBodyID').classList.remove('contract-completed');
                        document.getElementById('chatCPBodyID').classList.remove('contract-completed');
                        document.getElementById('sameSideTypeBox').classList.remove(displayNoneClass);
                        document.getElementById('counterpartyTypeBox').classList.remove(displayNoneClass);
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
                    } else if (data.messageType == "Meeting") {
                        htmlHistory += '<div class="scheduled-meeting" data-id="' + data.meetingId + '">\n' +
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
                    } else {
                        htmlHistory += '<div class="message-wrapper reverse">\n' +
                            '   <div class="profile-picture">\n' +
                            '      <p class="last-seen">' + formatDate(new Date()) + '</p>\n' +
                            '      <p class="name">' + data.actionperformedbyUser + '&nbsp;<small>' + (data && data.actionperformedbyUserRole ? data.actionperformedbyUserRole : '') + '</small>' + '</p>\n' +
                            '      <img src="' + (data.actionperformedbyUserImage ? data.actionperformedbyUserImage : 'images/no-profile-image.jpg') + '" alt="pp">\n' +
                            '   </div>\n' +
                            '   <div class="message-content">\n' +
                            '      <div class="message">' + (data.message ? data.message.trim().replaceAll(/\n/g, '<br>') : '') + '</div>\n' +
                            '   </div>\n' +
                            '</div>\n';
                    }
                }
                var contentHistoryDiv = document.getElementById("chatHistoryArea");
                var newHistoryElement = document.createElement("div");
                newHistoryElement.innerHTML = htmlHistory;
                contentHistoryDiv.appendChild(newHistoryElement);
                var scrollableDiv = document.getElementById('chatHistoryBodyID');
                var scrollPositionFromBottom = scrollableDiv.scrollHeight - (scrollableDiv.scrollTop + scrollableDiv.clientHeight)
                if (scrollPositionFromBottom <= 600) {
                    var myDiv = document.getElementById("chatHistoryBodyID");
                    var scrollToOptions = {
                        top: myDiv.scrollHeight,
                        behavior: 'smooth'
                    };
                    myDiv.scrollTo(scrollToOptions);
                }
            });

            socket.on('forward_new_clause_create', async function (data) {
                if (data) {
                    // console.log('forward_new_clause_create __data', data);
                    tagLists.push(JSON.parse(data));
                    clauseNextPage = 1;
                    clauseHasNextPage = true;
                    clauseLists = [];
                    await getContractSectionList();
                }
            });

            socket.on('forward_invite_clause', async function (data) {
                if (data) {
                    clauseNextPage = 1;
                    clauseHasNextPage = true;
                    clauseLists = [];
                    await getContractSectionList();
                }
            });

            // Handle connection errors
            socket.on('connect_error', (error) => {
                console.error('Connection Error:', error.message);
            });

            // Handle server-rejected connections
            socket.on('connect_failed', () => {
                console.error('Connection to server failed');
            });

            // Handle general error events
            socket.on('error', (error) => {
                console.error('Socket Error:', error);
            });

            flagSocketFunctionInit = true;
        }
        /**============================== Socket Function End =================================*/
    }

    /**============================== Utils Function End ==================================*/

    /**================================ API Function Start ================================*/
    /**
     * @desc Get open contract and user details
     */
    function getOpenContractUserDetails(socket, redirection = true) {
        var getContractUserDetailsUrl = apiBaseUrl + '/contract/getOpenContractUserDetails/' + documentID;
        var headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + authToken
        };
        var requestOptions = {
            method: 'GET',
            headers: headers,
        };
        fetch(getContractUserDetailsUrl, requestOptions)
            .then(response => response.json())
            .then(data => {
                // Handle the response data
                var responseData = data;
                if (responseData && responseData.status == true && responseData.code == 200 && responseData.data) {
                    if (responseData.data.openContractDetails && responseData.data.openContractDetails.counterPartyInviteStatus == 'Accepted') {
                        if (documentMode !== 'markup') {
                            var sDocumentEditingRestrictions = "readOnly";
                            window.Asc.plugin.executeMethod("SetEditingRestrictions", [sDocumentEditingRestrictions]);
                        }
                    }
                    if (responseData.data.openContractDetails && responseData.data.openContractDetails.userWhoHasEditAccess && responseData.data.openContractDetails.userWhoHasEditAccess == responseData.data.loggedInUserDetails._id && responseData.data.contractCurrentState == 'Edit') {
                        var sDocumentEditingRestrictions = "none";
                        window.Asc.plugin.executeMethod("SetEditingRestrictions", [sDocumentEditingRestrictions]);
                    }
                    flagInit = true;
                    openContractUserDetails = responseData.data;
                    if (selectedThreadID) {
                        var getClauseDetails = clauseLists.find((ele) => ele._id == selectedThreadID);
                        if (openContractUserDetails && openContractUserDetails.openContractDetails && openContractUserDetails.canSendPositionConfirmation && getClauseDetails && getClauseDetails.isSectionInDraftMode) {
                            if (openContractUserDetails.openContractDetails.userWhoHasEditAccess == loggedInUserDetails._id || loggedInUserDetails.role == "Counterparty" || loggedInUserDetails.role == "Contract Creator") {
                                document.getElementById('toggleSendPositionConfirmationA').setAttribute('title', 'Send for Draft Confirmation');
                            } else {
                                document.getElementById('toggleSendPositionConfirmationA').setAttribute('title', 'Send for Position Confirmation');
                            }
                        } else {
                            document.getElementById('toggleSendPositionConfirmationA').setAttribute('title', 'Send for Position Confirmation');
                        }
                    } else {
                        document.getElementById('toggleSendPositionConfirmationA').setAttribute('title', 'Send for Position Confirmation');
                    }
                    document.title = "ProPact | " + openContractUserDetails.loggedInUserDetails.firstName + " " + openContractUserDetails.loggedInUserDetails.lastName + " " + openContractUserDetails.loggedInUserDetails.role;
                    if (responseData.data.loggedInUserDetails) {
                        loggedInUserDetails = responseData.data.loggedInUserDetails;
                        document.getElementById('userProfileImage').src = responseData.data.loggedInUserDetails.imageUrl ?? 'images/no-profile-image.jpg';
                        document.getElementById('userProfileImageA').src = responseData.data.loggedInUserDetails.imageUrl ?? 'images/no-profile-image.jpg';
                        document.getElementById('userProfileName').textContent = responseData.data.loggedInUserDetails.firstName + " " + responseData.data.loggedInUserDetails.lastName;
                        document.getElementById('userProfileNameA').textContent = responseData.data.loggedInUserDetails.firstName + " " + responseData.data.loggedInUserDetails.lastName;
                        document.getElementById('userProfilerole').textContent = responseData.data.loggedInUserDetails.role;
                        document.getElementById('userProfileroleA').textContent = responseData.data.loggedInUserDetails.role;
                    }
                    if (documentMode != 'markup') {
                        getContractTeamAndUserList();
                    }

                    if (responseData.data.invitationDetail && responseData.data.invitationDetail._id) {
                        setupSocket();
                        if (!loggedInUserDetails.isCustomer) {
                            document.getElementById('invitationActionPara').classList.add(displayNoneClass);
                        }
                        document.getElementById('divInviteCounterparty').classList.add(displayNoneClass);
                        document.getElementById('divInviteCounterpartyPending').classList.remove(displayNoneClass);
                        document.getElementById('contractListItemsDiv').classList.add('displayed-invitecp-pending');
                        document.getElementById('contractListItemsDiv').classList.remove('displayed-invitecp');
                        document.getElementById('organizationName').textContent = responseData.data.invitationDetail.organizationName;
                        document.getElementById('counterpartyName').textContent = responseData.data.invitationDetail.firstName + " " + responseData.data.invitationDetail.lastName + " - Counterparty";
                        document.getElementById('counterpartyEmail').textContent = responseData.data.invitationDetail.email;
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
                        }
                        document.getElementById('btnGoToCounterparty').classList.add(displayNoneClass);
                        document.getElementById('btnGoToCounterpartyA').classList.add(displayNoneClass);
                        $('#chatFooterInner').addClass('justify-content-end');
                    } else if (responseData.data.oppositeUser && responseData.data.oppositeUser._id) {
                        counterPartyCustomerDetail = responseData.data.oppositeUser;
                        if (redirection == true) {
                            document.getElementById('divInviteCounterpartyPending').classList.add(displayNoneClass);
                            document.getElementById('divInviteCounterparty').classList.add(displayNoneClass);
                            document.getElementById('invitationActionPara').classList.add(displayNoneClass);
                            document.getElementById('divContractLists').classList.remove(displayNoneClass);
                            document.getElementById('contractCounterpartySection').classList.remove(disabledClass);
                            document.getElementById('contractListItemsDiv').classList.remove('displayed-invitecp-pending');
                            document.getElementById('contractListItemsDiv').classList.remove('displayed-invitecp');
                        }
                        document.getElementById('oppsiteUserProfileImage').src = responseData.data.oppositeUser.imageUrl ?? 'images/no-profile-image.jpg';
                        document.getElementById('counterpartyImage').src = responseData.data.oppositeUser.imageUrl ?? 'images/no-profile-image.jpg';
                        document.getElementById('counterpartyImage').src = responseData.data.oppositeUser.imageUrl ?? 'images/no-profile-image.jpg';
                        document.getElementById('oppsiteUserProfileName').textContent = responseData.data.oppositeUser.firstName + " " + responseData.data.oppositeUser.lastName;
                        document.getElementById('oppsiteUserProfilerole').textContent = responseData.data.oppositeUser.role;
                        document.getElementById('organizationName').textContent = responseData.data.oppositeUser.company.companyName;
                        document.getElementById('counterpartyName').textContent = responseData.data.oppositeUser.firstName + " " + responseData.data.oppositeUser.lastName;
                        clauseNextPage = 1;
                        clauseHasNextPage = true;
                        clauseLists = [];
                        getContractSectionList();
                        setupSocket();
                        document.getElementById('btnMarkupMode').classList.remove(displayNoneClass);
                        $('#btnMarkupMode').parent().removeClass('justify-content-end');
                    } else if ((responseData.data.openContractDetails && responseData.data.openContractDetails.counterPartyInviteStatus && responseData.data.openContractDetails.counterPartyInviteStatus == 'Pending') || responseData.data.counterPartyInviteStatus == 'Pending') {
                        setupSocket();
                        document.getElementById('divInviteCounterparty').classList.remove(displayNoneClass);
                        document.getElementById('contractListItemsDiv').classList.add('displayed-invitecp');
                        document.getElementById('contractListItemsDiv').classList.remove('displayed-invitecp-pending');
                        if (!loggedInUserDetails.isCustomer) {
                            document.getElementById('btnRedirectInviteCounterpartyForm').classList.add('disabled');
                        }
                        document.getElementById('btnGoToCounterparty').classList.add(displayNoneClass);
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
                        }
                    }
                }
            })
            .catch(error => {
                // Handle any errors
                console.error('Error:', error);
            });
    }

    /**
     * @desc Get contract team and user list for clause create form
     */
    function getContractTeamAndUserList(popup = 'inviteuser') {
        var getContractTeamAndUserListUrl = apiBaseUrl + '/meeting/getContractTeamAndUserList/' + documentID;
        var headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + authToken
        };
        var requestOptions = {
            method: 'GET',
            headers: headers,
        };
        fetch(getContractTeamAndUserListUrl, requestOptions)
            .then(response => response.json())
            .then(data => {
                // Handle the response data
                var responseData = data;
                if (responseData && responseData.data) {
                    if (popup == 'inviteuser') {
                        var contractCreatorUserFilter = responseData.data.filter((ele) => ele.type == "user" && ele.role == "Contract Creator");
                        if (contractCreatorUserFilter && contractCreatorUserFilter.length > 0) {
                            contractCreatorDetails = contractCreatorUserFilter[0];
                        }
                        var contractCounterpartyFilter = responseData.data.filter((ele) => ele.type == "user" && ele.role == "Counterparty");
                        if (contractCounterpartyFilter && contractCounterpartyFilter.length > 0) {
                            contractCounterpartyDetails = contractCounterpartyFilter[0];
                        }
                        var teamLists = responseData.data.filter((ele) => {
                            return ele.type == "team";
                        });
                        var userLists = responseData.data.filter((ele) => {
                            return ele.type == "user" && (ele.role !== "Contract Creator" && ele.role !== "Counterparty");
                        });
                        if (teamLists.length > 0) {
                            inviteTeamListIDs = teamLists;
                            var teamsNoteFoundMessage = document.getElementById('teamsNoteFoundMessage');
                            if (teamsNoteFoundMessage) {
                                teamsNoteFoundMessage.classList.add(displayNoneClass);
                            }
                            var inviteteams = document.getElementById('inviteteams');
                            if (inviteteams) {
                                inviteteams.classList.remove(displayNoneClass);
                            }
                            var html = '';
                            html += '<div class="filter-inner">\n';
                            html += '<ul>\n';
                            teamLists.forEach((ele) => {
                                html += '<li>\n' +
                                    '<div class="form-check" data-id="' + ele.itemId + '" data-json="' + JSON.stringify(ele) + '">\n' +
                                    '<input type="checkbox" id="inviteteam_' + ele.itemId + '" class="form-check-input team-chkbox" />' +
                                    '<label for="inviteteam_' + ele.itemId + '" class="form-check-label">\n' +
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
                            //accordionBodyTeams
                            document.getElementById('accordionBodyTeams').innerHTML = html;
                        }
                        if (userLists.length > 0) {
                            inviteUserListIDs = userLists;
                            var usersNoteFoundMessage = document.getElementById('usersNoteFoundMessage');
                            if (usersNoteFoundMessage) {
                                usersNoteFoundMessage.classList.add(displayNoneClass);
                            }
                            var inviteusers = document.getElementById('inviteusers');
                            if (inviteusers) {
                                inviteusers.classList.remove(displayNoneClass);
                            }
                            var html = '';
                            html += '<div class="filter-inner">';
                            html += '<ul>';
                            // ' + IMAGE_USER_PATH_LINK + ele.userImage + '
                            // assets/images/no-profile-image.jpg
                            userLists.forEach((ele) => {
                                html += '<li>';
                                html += '<div class="form-check" data-id="' + ele.itemId + '" data-json="' + JSON.stringify(ele) + '">\n' +
                                    '\t<input type="checkbox" id="inviteuser_' + ele.itemId + '" class="form-check-input user-chkbox" value="' + ele.itemId + '">\n' +
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
                                html += '</li>';
                            });
                            html += '</ul>';
                            html += '</div>';
                            document.getElementById('accordionBodyUsers').innerHTML = html;
                        }
                    } else if (popup == 'assignDraftRequest') {
                        var userLists = [];
                        if (loggedInUserDetails.isCounterPartyCustomer || loggedInUserDetails.isCounterPartyUser) {
                            userLists = responseData.data.filter((ele) => {
                                return ele.type == "user" && (ele.role == "Counterparty" || ele.role == "Position Confirmer") && ele.canDraftContract;
                            });
                        } else {
                            userLists = responseData.data.filter((ele) => {
                                return ele.type == "user" && (ele.role == "Contract Creator" || ele.role == "Position Confirmer") && ele.canDraftContract;
                            });
                        }
                        if (userLists.length > 0) {
                            inviteUserListIDs = userLists;
                            var usersNoteFoundMessage = document.getElementById('usersNoteFoundMessageA');
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
                                html += '<div class="draft-request-user" data-id="' + ele.itemId + '" data-name="' + ele.itemName + '" data-json="' + JSON.stringify(ele) + '">\n' +
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
                                html += '</li>';
                            });
                            html += '</ul>';
                            html += '</div>';
                            document.getElementById('accordionBodyUsersA').innerHTML = html;
                        }
                    } else if (popup == 'positionConfirmation') {
                        var userLists = responseData.data.filter((ele) => {
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
                            document.getElementById('accordionBodyUsersB').innerHTML = html;
                        }
                    }
                }
            })
            .catch(error => {
                // Handle any errors
                console.error('Error:', error);
            });
    }

    /**
     * @desc Get list of contract sections
     */
    async function getContractSectionList(commentThreadID = null) {
        var getContractSectionListUrl = apiBaseUrl + '/contractSection/getSelectedStatusContractSection/all/' + documentID;
        //?filter[description]=Test&sort[createdAt]=-1&page=1&limit=6
        getContractSectionListUrl += '?';
        var queryParam = [];
        // Search text
        if (searchText) {
            queryParam.push('filter[search_text]=' + searchText);
        }
        // Set sortby created time
        queryParam.push('sort[createdAt]=-1');
        // Set pageSize
        queryParam.push('page=' + clauseNextPage);
        // Set recordLimit
        queryParam.push('limit=' + clauseRecordLimit);
        // Set queryparams
        getContractSectionListUrl += queryParam.join('&');
        var headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + authToken
        };
        var requestOptions = {
            method: 'GET',
            headers: headers,
        };
        fetch(getContractSectionListUrl, requestOptions)
            .then(response => response.json())
            .then(data => {
                // Handle the response data
                var responseData = data;
                if (responseData && responseData.data) {
                    var resData = responseData.data;
                    if (clauseNextPage == 1) {
                        document.getElementById('contractListItemsDiv').innerHTML = '';
                    }
                    if (resData.data.length > 0) {
                        var result = resData.data;
                        var html = '';
                        result.forEach((ele) => {
                            clauseLists.push(ele);
                            var commentID = ele.commentId;
                            html += '<div class="contract-item" data-id="' + ele._id + '" data-commentid="' + commentID + '" data-chatwindow="' + (ele.unreadMessageSide ? ele.unreadMessageSide : '-')  + '" id="' + commentID.split('-').pop() + '">\n' +
                                '\t\t\t<a href="#">\n';
                            html += '\t\t\t\t\t\t<span class="notification-no ' + (ele.hasUnreadMessage ? '' : displayNoneClass) + '"></span>';
                            html += '\t\t\t\t\t\t<div class="contract-top">\n' +
                                '\t\t\t\t\t\t\t\t\t<h3>' + ele.contractSection + '</h3>\n' +
                                '\t\t\t\t\t\t\t\t\t<p>' + ele.contractDescription + '</p>\n';
                            var contractStatusColorCode = 'active-color';
                            if (ele.contractStatus == 'Drafting') {
                                contractStatusColorCode = 'fuchsia-color';
                            } else if (ele.contractStatus == 'Under Negotiation') {
                                contractStatusColorCode = 'blue-color';
                            } else if (ele.contractStatus == 'Agreed Position') {
                                contractStatusColorCode = 'dark-green-color';
                            } else if (ele.contractStatus == 'Under Revision') {
                                contractStatusColorCode = 'brown-color';
                            } else if (ele.contractStatus == 'Requires Discussion') {
                                contractStatusColorCode = 'invited-color';
                            } else if (ele.contractStatus == 'Completed') {
                                contractStatusColorCode = 'success-color';
                            }
                            html += '\t\t\t\t\t\t\t\t\t<button class="btn ' + contractStatusColorCode + '">' + ele.contractStatus + '</button>\n';

                            html += '\t\t\t\t\t\t</div>\n' +
                                '\t\t\t\t\t\t<div class="contract-foot">\n' +
                                '\t\t\t\t\t\t\t\t\t<div class="contract-foot-inner">\n' +
                                '\t\t\t\t\t\t\t\t\t\t\t\t<div class="contract-foot-item">\n' +
                                '\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<h3>Created by</h3>\n' +
                                '\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div class="contract-user">\n';

                            html += '\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div class="approved-user-lists"><img src="' + (ele && ele.createdByUserDetails && ele.createdByUserDetails.imageUrl ? ele.createdByUserDetails.imageUrl : 'images/no-profile-image.jpg') + '" alt="">\n' +
                                '\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<span>' + (ele && ele.createdByUserDetails ? ele.createdByUserDetails.firstName + ' ' + ele.createdByUserDetails.lastName : '') + '</span></div>\n';

                            html += '\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</div>\n' +
                                '\t\t\t\t\t\t\t\t\t\t\t\t</div>\n' +
                                '\t\t\t\t\t\t\t\t\t\t\t\t<div class="contract-foot-item">\n' +
                                '\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<h3>Requires action by</h3>\n' +
                                '\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div class="contract-user">\n';

                            if (ele && ele.actionRequiredByUsers && ele.actionRequiredByUsers.length > 0) {
                                ele.actionRequiredByUsers.forEach((element) => {
                                    html += '\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div class="approved-user-lists"><img src="' + (element && ele?.imageUrl ? ele?.imageUrl : 'images/no-profile-image.jpg') + '" alt="">\n' +
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
                        if (clauseNextPage == 1) {
                            document.getElementById('contractListItemsDiv').innerHTML += html;
                        } else {
                            var newElement = document.createElement("div");
                            newElement.innerHTML = html;
                            document.getElementById('contractListItemsDiv').insertAdjacentElement("beforeend", newElement);
                        }
                        if (!flagRedirectFirst && sectionID) {
                            setTimeout(function () {
                                $('.contract-item[data-id="' + sectionID + '"]').click();
                                if (chatWindows == 'SS') {
                                    $('#btnGoToSameSideChat').click();
                                } else if (chatWindows == 'CP') {
                                    $('#btnGoToCounterparty').click();
                                }
                                flagRedirectFirst = true;
                            }, 500);
                        } else if (commentThreadID) {
                            setTimeout(function () {
                                flagRedirectClauseCreate = true;
                                $('.contract-item[data-commentid="' + commentThreadID + '"]').click();
                                $('#btnGoToSameSideChat').click();
                                if (!openContractUserDetails.canCommunicateWithCounterparty) {
                                    document.getElementById('btnGoToCounterparty').classList.add(displayNoneClass);
                                    document.getElementById('btnGoToCounterpartyA').classList.add(displayNoneClass);
                                    $('#chatFooterInner').addClass('justify-content-end');
                                }
                                if (openContractUserDetails.openContractDetails.counterPartyInviteStatus != 'Accepted') {
                                    document.getElementById('btnGoToCounterparty').classList.add(displayNoneClass);
                                    document.getElementById('btnGoToCounterpartyA').classList.add(displayNoneClass);
                                    $('#chatFooterInner').addClass('justify-content-end');
                                }
                            }, 500);
                        }
                        clauseHasNextPage = resData.hasNextPage;
                        clauseNextPage = resData.nextPage;
                    } else {
                        var norecordhtml = '<p class="nodata-info">No clauses available</p>';
                        document.getElementById('contractListItemsDiv').innerHTML = norecordhtml;
                    }
                }
            })
            .catch(error => {
                // Handle any errors
                console.error('Error:', error);
            });
    }

    /**
     * @desc Invite the counterparty
     */
    function inviteCounterparties() {
        try {
            document.getElementById('mainLoader').classList.remove(displayNoneClass);
            var form = document.getElementById('inviteForm');
            var data = JSON.stringify({
                firstName: form.elements['firstName'].value,
                lastName: form.elements['lastName'].value,
                email: form.elements['email'].value,
                organizationName: form.elements['organisationName'].value
            });
            var inviteCounterpartiesUrl = apiBaseUrl + '/contract/inviteCounterPartyUser/' + documentID;
            var headers = {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + authToken
            };
            var requestOptions = {
                method: 'POST',
                headers: headers,
                body: data
            };
            fetch(inviteCounterpartiesUrl, requestOptions)
                .then(response => response.json())
                .then(data => {
                    // Handle the response data
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
     * @desc Cancel the counterparty invitation
     */
    function cancelInvitation() {
        try {
            document.getElementById('mainLoader').classList.remove(displayNoneClass);
            var cancelInvitationsUrl = apiBaseUrl + '/contract/cancelInvitationEmail/' + documentID;
            var headers = {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + authToken
            };
            var requestOptions = {
                method: 'GET',
                headers: headers,
            };
            fetch(cancelInvitationsUrl, requestOptions)
                .then(response => response.json())
                .then(data => {
                    // Handle the response data
                    var responseData = data;
                    if (responseData && responseData.status == true && responseData.code == 200) {
                        var x = document.getElementById("snackbar");
                        x.textContent = responseData.message;
                        x.className = "show";
                        setTimeout(function () {
                            x.classList.remove('show');
                        }, 3000)
                        document.getElementById('divInviteCounterpartyPending').classList.add(displayNoneClass);
                        document.getElementById('divInviteCounterparty').classList.remove(displayNoneClass);
                        document.getElementById('contractListItemsDiv').classList.remove('displayed-invitecp-pending');
                        document.getElementById('contractListItemsDiv').classList.add('displayed-invitecp');
                    }
                    document.getElementById('mainLoader').classList.add(displayNoneClass);
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
     * @desc Resend counterparty invitation
     */
    function resendCounterpartyInvitation() {
        try {
            document.getElementById('mainLoader').classList.remove(displayNoneClass);
            var resendCounterpartyInvitationUrl = apiBaseUrl + '/contract/resendInvitationEmail/' + documentID;
            var headers = {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + authToken
            };
            var requestOptions = {
                method: 'GET',
                headers: headers,
            };
            fetch(resendCounterpartyInvitationUrl, requestOptions)
                .then(response => response.json())
                .then(data => {
                    // Handle the response data
                    var responseData = data;
                    if (responseData && responseData.status == true && responseData.code == 200) {
                        // console.log(responseData.message);
                        var x = document.getElementById("snackbar");
                        x.textContent = responseData.message;
                        x.className = "show";
                        setTimeout(function () {
                            x.classList.remove('show');
                        }, 3000)
                    }
                    document.getElementById('mainLoader').classList.add(displayNoneClass);
                })
                .catch(error => {
                    // Handle any errors
                    console.error('Error:', error);
                    document.getElementById('mainLoader').classList.add(displayNoneClass);
                });
        } catch (error) {
            console.error('Error fetching data:', error);
            document.getElementById('mainLoader').classList.add(displayNoneClass);
        }

    }

    /**
     * @desc Create clause section
     */
    function createClauseSection(socket) {
        try {
            document.getElementById('mainLoader').classList.remove(displayNoneClass);
            var randomNumber = Math.floor(Math.random() * (1000000 - 1 + 1)) + 1;
            var commentID = Date.now() + '-' + randomNumber;
            var form = document.getElementById('clauseForm');
            var data = JSON.stringify({
                contractId: documentID,
                contractSection: form.elements['contractSection'].value,
                contractDescription: form.elements['contractDescription'].value,
                assignedTeamAndUserDetails: [...selectedInvitedTeams, ...selectedInvitedUsers],
                commentId: commentID
            });
            var createClauseSectionUrl = apiBaseUrl + '/contractSection/createNewContractSection';
            var headers = {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + authToken
            };
            var requestOptions = {
                method: 'POST',
                headers: headers,
                body: data
            };
            fetch(createClauseSectionUrl, requestOptions)
                .then(response => response.json())
                .then(data => {
                    // Handle the response data
                    document.getElementById('clauseForm').reset();
                    if ($('#inviteteams').prop('checked')) {
                        $('#inviteteams').click();
                    }
                    if ($('#inviteusers').prop('checked')) {
                        $('#inviteusers').click();
                    }
                    var placeholderText = 'Select users and teams';
                    document.getElementById('inviteUsersInput').placeholder = placeholderText;
                    selectedInvitedTeams = [];
                    selectedInvitedUsers = [];
                    $('#inviteUsersInput').click();
                    $('#collapseTeams, #collapseUsers').collapse('hide');
                    var responseData = data;
                    if (responseData && responseData.status == true && responseData.code == 200) {
                        var sDocumentEditingRestrictions = "none";
                        window.Asc.plugin.executeMethod("SetEditingRestrictions", [sDocumentEditingRestrictions]);
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
                        window.Asc.plugin.executeMethod("AddContentControl", [nContentControlType, nContentControlProperties]);
                        var sDocumentEditingRestrictions = "readOnly";
                        window.Asc.plugin.executeMethod("SetEditingRestrictions", [sDocumentEditingRestrictions]);
                        clauseNextPage = 1;
                        clauseHasNextPage = true;
                        clauseLists = [];
                        getContractSectionList(commentID);
                        var data = {
                            chatRoomName: documentID,
                            tagData: JSON.stringify(nContentControlProperties)
                        };
                        socket.emit('new_clause_created', data);
                        // location.reload(true);
                        document.getElementById('divContractChatHistory').classList.add(displayNoneClass);
                        document.getElementById('divContractCreate').classList.add(displayNoneClass);
                        document.getElementById('divContractLists').classList.remove(displayNoneClass);
                        document.getElementById('mainLoader').classList.add(displayNoneClass);
                    } else {
                        document.getElementById('mainLoader').classList.add(displayNoneClass);
                    }
                })
                .catch(error => {
                    // Handle any errors
                    console.error('Error:', error);
                    document.getElementById('mainLoader').classList.add(displayNoneClass);
                });
        } catch (error) {
            console.error('Error fetching data:', error);
            document.getElementById('mainLoader').classList.add(displayNoneClass);
            // throw error; // You can re-throw the error or handle it here
        }
    }

    /**
     * @param postData
     * @param socket
     * @returns {Promise<void>}
     */
    async function addContractSectionMessage(postData, socket) {
        try {
            document.getElementById('mainLoader').classList.remove(displayNoneClass);
            var data = JSON.stringify(postData);
            var addContractSectionMessageUrl = apiBaseUrl + '/contractSection/addContractSectionMessage';
            var headers = {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + authToken
            };
            var requestOptions = {
                method: 'POST',
                headers: headers,
                body: data
            };
            fetch(addContractSectionMessageUrl, requestOptions)
                .then(response => response.json())
                .then(data => {
                    // Handle the response data
                    document.getElementById("clauseForm").reset();
                    var responseData = data;
                    if (responseData && responseData.status == true && responseData.code == 200) {

                        var conversationType = 'OTM';
                        if (loggedInUserDetails.company._id.toString() == openContractUserDetails.openContractDetails.companyId.toString() && postData.with == "Our Team") {
                            conversationType = 'OTCC';
                        } else if (loggedInUserDetails.company._id.toString() == openContractUserDetails.openContractDetails.counterPartyCompanyId.toString() && postData.with == "Our Team") {
                            conversationType = 'OTCP';
                        }

                        socket.emit('contract_section_message', postData);
                        var generalChatData = postData;
                        generalChatData.chatRoomName = 'conversion_history_' + selectedCommentThereadID;
                        generalChatData.conversationType = conversationType;
                        socket.emit('conversion_history_message', generalChatData);

                        if (postData.with == "Counterparty") {
                            var myTextarea = document.getElementById("messageInputCP");
                            myTextarea.value = "";
                        } else {
                            var myTextarea = document.getElementById("messageInput");
                            myTextarea.value = "";
                        }

                        var html = '<div class="message-wrapper reverse ' + (postData.with == "Counterparty" ? "light-gold-color" : "") + ' ">\n' +
                            '   <div class="profile-picture">\n' +
                            '      <p class="last-seen">' + formatDate(new Date()) + '</p>\n' +
                            '      <p class="name">' + postData.actionperformedbyUser + '</p>\n' +
                            '      <img src="' + (postData.actionperformedbyUserImage ? postData.actionperformedbyUserImage : 'images/no-profile-image.jpg') + '" alt="pp">\n' +
                            '   </div>\n' +
                            '   <div class="message-content">\n' +
                            '      <div class="message">' + (postData.message ? postData.message.trim().replaceAll(/\n/g, '<br>') : '') + '</div>\n' +
                            '   </div>\n' +
                            '</div>\n';

                        if (postData.with == "Counterparty") {
                            var contentDiv = document.getElementById("chatCPArea");
                            var newElement = document.createElement("div");
                            newElement.innerHTML = html;
                            contentDiv.appendChild(newElement);

                            var myDiv = document.getElementById("chatCPBodyID");
                            var scrollToOptions = {
                                top: myDiv.scrollHeight,
                                behavior: 'smooth'
                            };
                            myDiv.scrollTo(scrollToOptions);
                        } else {
                            var contentDiv = document.getElementById("chatArea");
                            var newElement = document.createElement("div");
                            newElement.innerHTML = html;
                            contentDiv.appendChild(newElement);

                            var myDiv = document.getElementById("chatBodyID");
                            var scrollToOptions = {
                                top: myDiv.scrollHeight,
                                behavior: 'smooth'
                            };
                            myDiv.scrollTo(scrollToOptions);
                        }
                        document.getElementById('mainLoader').classList.add(displayNoneClass);
                        return true;
                    } else {
                        document.getElementById('mainLoader').classList.add(displayNoneClass);
                    }
                })
                .catch(error => {
                    // Handle any errors
                    console.error('Error:', error);
                    document.getElementById('mainLoader').classList.add(displayNoneClass);
                });
        } catch (error) {
            console.error('Error fetching data:', error);
            document.getElementById('mainLoader').classList.add(displayNoneClass);
        }
    }

    /**
     * @param messageType
     * @returns {Promise<void>}
     */
    async function getContractSectionMessageList(messageType = 'our') {
        try {
            document.getElementById('mainLoader').classList.remove(displayNoneClass);
            var getContractSectionMessageListUrl = apiBaseUrl + '/contractSection/getContractSectionMessageList/' + selectedThreadID + '/' + messageType;
            var queryParam = [];
            // Set sortby created time
            queryParam.push('sort[createdAt]=-1');
            // Set pageSize
            queryParam.push('page=' + chatNextPage);
            // Set recordLimit
            queryParam.push('limit=' + chatRecordLimit);
            // Set queryparams
            getContractSectionMessageListUrl += '?' + queryParam.join('&');
            var headers = {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + authToken
            };
            var requestOptions = {
                method: 'GET',
                headers: headers,
            };
            fetch(getContractSectionMessageListUrl, requestOptions)
                .then(response => response.json())
                .then(data => {
                    // Handle the response data
                    var responseData = data;
                    if (responseData && responseData.status == true && responseData.code == 200 && responseData.data) {
                        if (responseData.data.data.length > 0) {
                            var result;
                            if (chatNextPage == 1) {
                                if (messageType == 'our') {
                                    document.getElementById('chatArea').innerHTML = '';
                                    result = responseData?.data?.data.reverse();
                                    var myDiv = document.getElementById("chatBodyID");
                                    var scrollToOptions = {
                                        top: myDiv.scrollHeight,
                                        behavior: 'smooth'
                                    };
                                    myDiv.scrollTo(scrollToOptions);
                                } else {
                                    document.getElementById('chatCPArea').innerHTML = '';
                                    result = responseData?.data?.data.reverse();
                                    var myDiv = document.getElementById("chatCPBodyID");
                                    var scrollToOptions = {
                                        top: myDiv.scrollHeight,
                                        behavior: 'smooth'
                                    };
                                    myDiv.scrollTo(scrollToOptions);
                                }
                            } else {
                                result = responseData?.data?.data;
                            }
                            var setLastHeight;
                            if (messageType == 'our') {
                                setLastHeight = document.getElementById('chatArea').scrollHeight;
                            } else {
                                setLastHeight = document.getElementById('chatCPArea').scrollHeight;
                            }

                            result.forEach((chatMessage) => {
                                var html = '';
                                if (chatMessage.from == loggedInUserDetails._id) {
                                    if (chatMessage.messageType == 'Normal') {
                                        html += '<div class="message-wrapper reverse ' + (messageType == "Counterparty" ? "light-gold-color" : "") + '">\n' +
                                            '       <div class="profile-picture">\n' +
                                            '           <p class="last-seen">' + formatDate(chatMessage.createdAt) + '</p>\n' +
                                            '           <p class="name">' + chatMessage.messageSenderUser.firstName + ' ' + chatMessage.messageSenderUser.lastName + '</p>\n' +
                                            '           <img src="' + (chatMessage && chatMessage.messageSenderUser && chatMessage.messageSenderUser.imageUrl ? chatMessage.messageSenderUser.imageUrl : 'images/no-profile-image.jpg') + '" alt="pp">\n' +
                                            '       </div>\n' +
                                            '       <div class="message-content">\n' +
                                            '           <div class="message">' + (chatMessage.message ? chatMessage.message.trim().replaceAll(/\n/g, '<br>') : '') + '</div>\n' +
                                            '       </div>\n' +
                                            '</div>\n';
                                    } else if (chatMessage.messageType == 'Position Confirmation') {
                                        html += '<div class="message-wrapper reverse ' + (messageType == "Counterparty" && chatMessage.messageStatus != 'Reject' ? "dark-gold-color" : "") + ' ' + (chatMessage.messageStatus == 'Reject' ? "red-color" : "") + '">\n' +
                                            '       <div class="profile-picture">\n' +
                                            '           <p class="last-seen">' + formatDate(chatMessage.createdAt) + '</p>\n' +
                                            '           <p class="name">' + chatMessage.messageSenderUser.firstName + ' ' + chatMessage.messageSenderUser.lastName + '</p>\n' +
                                            '           <img src="' + (chatMessage && chatMessage.messageSenderUser && chatMessage.messageSenderUser.imageUrl ? chatMessage.messageSenderUser.imageUrl : 'images/no-profile-image.jpg') + '" alt="pp">\n' +
                                            '       </div>\n' +
                                            '       <div class="request-row">\n' +
                                            '           <div class="' + (messageType == "Counterparty" ? "message-content" : "request-content") + '">\n' +
                                            '               <h4>' + (chatMessage.messageStatus == 'None' || chatMessage.messageStatus == 'Updated' ? 'Sent a position confirmation <br/> request' : (chatMessage.messageStatus == 'Approve' ? 'Position confirmation approved' : 'Position confirmation rejected')) + '</h4>\n' +
                                            '               <div class="' + (messageType == "Counterparty" ? "message" : "content-message") + '">' + (chatMessage.message ? chatMessage.message.trim().replaceAll(/\n/g, '<br>') : '') + '</div>\n' +
                                            '           </div>\n';
                                        if (messageType == 'Counterparty') {
                                            if (chatMessage.from != loggedInUserDetails._id && chatMessage.companyId != loggedInUserDetails.company._id && chatMessage.messageStatus == 'None' && openContractUserDetails.canConfirmPosition) {
                                                html += '        <div class="request-btn">\n' +
                                                    '               <button class="btn reject-btn  reconfirm-reject " data-action="Reject"  data-id="' + chatMessage._id + '" >Reject</button>\n' +
                                                    '               <button class="btn btn-primary ' + (chatMessage.with != 'Counterparty' ? "approve-possition" : "reconfirm-approve") + '" data-action="Approve" data-id="' + chatMessage._id + '" >Approve</button>\n' +
                                                    '           </div>\n';
                                            }
                                        } else {
                                            if (chatMessage.from != loggedInUserDetails._id && chatMessage.messageStatus == 'None' && openContractUserDetails.canConfirmPosition) {
                                                html += '        <div class="request-btn">\n' +
                                                    '               <button class="btn reject-btn  reconfirm-reject " data-action="Reject"  data-id="' + chatMessage._id + '" >Reject</button>\n' +
                                                    '               <button class="btn btn-primary ' + (chatMessage.with != 'Counterparty' ? "approve-possition" : "reconfirm-approve") + '" data-action="Approve" data-id="' + chatMessage._id + '" >Approve</button>\n' +
                                                    '           </div>\n';
                                            }
                                        }
                                        html += '    </div>\n' +
                                            '</div>\n';
                                    } else if (chatMessage.messageType == 'Draft Edit Request') {
                                        var userName = chatMessage.messageSenderUser.firstName + " " + chatMessage.messageSenderUser.lastName;
                                        var receiverName = chatMessage.messageReceiverUser.firstName + " " + chatMessage.messageReceiverUser.lastName;
                                        html += '<div class="message-wrapper reverse ' + (chatMessage.with == "Counterparty" && chatMessage.messageStatus != 'Reject' ? "dark-gold-color" : "") + ' ' + (chatMessage.messageStatus == 'Reject' ? "red-color" : "") + '">\n' +
                                            '       <div class="profile-picture">\n' +
                                            '           <p class="last-seen">' + formatDate(chatMessage.createdAt) + '</p>\n' +
                                            '           <p class="name">' + chatMessage.messageSenderUser.firstName + ' ' + chatMessage.messageSenderUser.lastName + '</p>\n' +
                                            '           <img src="' + (chatMessage && chatMessage.messageSenderUser && chatMessage.messageSenderUser.imageUrl ? chatMessage.messageSenderUser.imageUrl : 'images/no-profile-image.jpg') + '" alt="pp">\n' +
                                            '       </div>\n' +
                                            '       <div class="request-row ' + (chatMessage.messageStatus == 'None' || chatMessage.messageStatus == 'Updated' ? 'dudhiya-color' : "") + '">\n' +
                                            '           <div class="' + (chatMessage.with == "Counterparty" ? "message-content" : "request-content") + '">\n' +
                                            '               <h4>' + (chatMessage.messageStatus == 'None' || chatMessage.messageStatus == 'Updated' ? 'Draft contract request' : (chatMessage.messageStatus == 'Approve' ? 'Draft contract request approved' : 'Draft contract request rejected')) + '</h4>\n' +
                                            '               <div class="' + (chatMessage.with == "Counterparty" ? "message" : "content-message") + '">\n' +
                                            '                   <p>Draft Request: ' + (chatMessage.message ? chatMessage.message.trim().replaceAll(/\n/g, '<br>') : '') + '</p>\n' +
                                            '                   <p>Note: ' + userName.trim() + ' has requested to give contract draft edit request to ' + receiverName.trim() + '.</p>\n' +
                                            '               </div>\n' +
                                            '           </div>\n';
                                        html += '       </div>\n' +
                                            '</div>\n';
                                    } else if (chatMessage.messageType == 'Draft Confirmation') {
                                        html += '<div class="message-wrapper reverse ' + (messageType == "Counterparty" && chatMessage.messageStatus != 'Reject' ? "dark-gold-color" : "") + ' ' + (chatMessage.messageStatus == 'Reject' ? "red-color" : "") + '">\n' +
                                            '       <div class="profile-picture">\n' +
                                            '           <p class="last-seen">' + formatDate(chatMessage.createdAt) + '</p>\n' +
                                            '           <p class="name">' + chatMessage.messageSenderUser.firstName + ' ' + chatMessage.messageSenderUser.lastName + '</p>\n' +
                                            '           <img src="' + (chatMessage && chatMessage.messageSenderUser && chatMessage.messageSenderUser.imageUrl ? chatMessage.messageSenderUser.imageUrl : 'images/no-profile-image.jpg') + '" alt="pp">\n' +
                                            '       </div>\n' +
                                            '       <div class="request-row">\n' +
                                            '           <div class="' + (messageType == "Counterparty" ? "message-content" : "request-content") + '">\n' +
                                            '               <h4>' + (chatMessage.messageStatus == 'None' || chatMessage.messageStatus == 'Updated' ? 'Draft confirmation request' : (chatMessage.messageStatus == 'Approve' ? 'Draft confirmation approved' : 'Draft confirmation rejected')) + '</h4>\n' +
                                            '               <div class="' + (messageType == "Counterparty" ? "message" : "content-message") + '">' + (chatMessage.message ? chatMessage.message.trim().replaceAll(/\n/g, '<br>') : '') + '</div>\n' +
                                            '           </div>\n';
                                        if (chatMessage.from != loggedInUserDetails._id && chatMessage.companyId != loggedInUserDetails.company._id && chatMessage.messageStatus == 'None' && openContractUserDetails.canConfirmPosition && (loggedInUserDetails.role == 'Contract Creator' || loggedInUserDetails.role == 'Counterparty')) {
                                            html += '        <div class="request-btn">\n' +
                                                '               <button class="btn reject-btn  draft-reject " data-action="Reject"  data-id="' + chatMessage._id + '" >Reject</button>\n' +
                                                '               <button class="btn btn-primary draft-approve" data-action="Approve" data-id="' + chatMessage._id + '" >Approve</button>\n' +
                                                '           </div>\n';
                                        }
                                        html += '    </div>\n' +
                                            '</div>\n';
                                    } else if (chatMessage.messageType == 'Draft Request') {
                                        html += '<div class="message-wrapper reverse ' + (messageType == "Counterparty" && chatMessage.messageStatus != 'Reject' ? "dark-gold-color" : "") + ' ' + (chatMessage.messageStatus == 'Reject' ? "red-color" : "") + '">\n' +
                                            '       <div class="profile-picture">\n' +
                                            '           <p class="last-seen">' + formatDate(chatMessage.createdAt) + '</p>\n' +
                                            '           <p class="name">' + chatMessage.messageSenderUser.firstName + ' ' + chatMessage.messageSenderUser.lastName + '</p>\n' +
                                            '           <img src="' + (chatMessage && chatMessage.messageSenderUser && chatMessage.messageSenderUser.imageUrl ? chatMessage.messageSenderUser.imageUrl : 'images/no-profile-image.jpg') + '" alt="pp">\n' +
                                            '       </div>\n' +
                                            '       <div class="request-row">\n' +
                                            '           <div class="' + (messageType == "Counterparty" ? "message-content" : "request-content") + '">\n' +
                                            '               <h4>Draft Request</h4>\n' +
                                            '               <div class="' + (messageType == "Counterparty" ? "message" : "content-message") + '">' + (chatMessage.message ? chatMessage.message.trim().replaceAll(/\n/g, '<br>') : '') + '</div>\n' +
                                            '           </div>\n';
                                        if (chatMessage.with == 'Our Team' && chatMessage.messageStatus == 'None' && chatMessage.sendTo == null && (loggedInUserDetails.role == 'Contract Creator' || loggedInUserDetails.role == 'Counterparty')) {
                                            html += '        <div class="request-btn">\n' +
                                                '               <button class="btn btn-primary assign-user" data-action="assign-user" data-id="' + chatMessage._id + '">Assign for Drafting</button>\n' +
                                                '           </div>\n';
                                        }
                                        html += '    </div>\n' +
                                            '</div>\n';
                                    } else if (chatMessage.messageType == 'Notification') {
                                        var notificationMessage;
                                        var userName = chatMessage.messageSenderUser.firstName + " " + chatMessage.messageSenderUser.lastName;
                                        if (chatMessage.message == 'request_draft_counter') {
                                            notificationMessage = userName.trim() + " has assigned opposite side to draft this contract section";
                                        } else if (chatMessage.message == 'request_draft') {
                                            if (chatMessage && chatMessage.messageReceiverUser) {
                                                var userReceiverName = chatMessage.messageReceiverUser.firstName + " " + chatMessage.messageReceiverUser.lastName;
                                                notificationMessage = userName.trim() + " has assigned " + userReceiverName.trim() + " to draft this contract section";
                                            } else {
                                                notificationMessage = userName.trim() + " has assigned a team member to draft this contract section";
                                            }
                                        } else {
                                            notificationMessage = chatMessage.message + ' ' + userName.trim();
                                        }
                                        html += '<div class="message-wrapper reverse ' + (messageType == "Counterparty" ? "light-gold-color" : "") + '">\n' +
                                            '       <div class="profile-picture">\n' +
                                            '           <p class="last-seen">' + formatDate(chatMessage.createdAt) + '</p>\n' +
                                            '           <p class="name">' + chatMessage.messageSenderUser.firstName + ' ' + chatMessage.messageSenderUser.lastName + '</p>\n' +
                                            '           <img src="' + (chatMessage && chatMessage.messageSenderUser && chatMessage.messageSenderUser.imageUrl ? chatMessage.messageSenderUser.imageUrl : 'images/no-profile-image.jpg') + '" alt="pp">\n' +
                                            '       </div>\n' +
                                            '       <div class="request-row">\n' +
                                            '           <strong>' + (notificationMessage ? notificationMessage.trim().replaceAll(/\n/g, '<br>') : '') + '</strong>\n' +
                                            '       </div>\n' +
                                            '</div>\n';
                                    } else if (chatMessage.messageType == 'Invite') {
                                        var inviteMessage = '';
                                        var userName = chatMessage.messageSenderUser.firstName + " " + chatMessage.messageSenderUser.lastName;
                                        if (chatMessage.inviteType == 'Team' && chatMessage.invitedTeamDetails) {
                                            inviteMessage += chatMessage.invitedTeamDetails.teamName;
                                        } else {
                                            var invitedUser = chatMessage.invitedUserDetails.firstName + " " + chatMessage.invitedUserDetails.lastName;
                                            inviteMessage += invitedUser.trim();
                                        }
                                        inviteMessage += ' ' + chatMessage.message + ' ' + userName.trim() + ' in this contract section';
                                        html += '<div class="message-wrapper reverse">\n' +
                                            '       <div class="profile-picture">\n' +
                                            '           <p class="last-seen">' + formatDate(chatMessage.createdAt) + '</p>\n' +
                                            '           <p class="name">' + userName.trim() + '</p>\n' +
                                            '           <img src="' + (chatMessage && chatMessage.messageSenderUser && chatMessage.messageSenderUser.imageUrl ? chatMessage.messageSenderUser.imageUrl : 'images/no-profile-image.jpg') + '" alt="pp">\n' +
                                            '       </div>\n' +
                                            '       <div class="request-row">\n' +
                                            '           <strong>' + inviteMessage + '</strong>\n' +
                                            '       </div>\n' +
                                            '</div>\n';
                                    } else if (chatMessage.messageType == 'Meeting') {
                                        html += '<div class="scheduled-meeting" data-id="' + chatMessage.meetingId + '">\n' +
                                            '          <div class="scheduled-meeting-inner">\n' +
                                            '            <div class="scheduled-meeting-icon">\n' +
                                            '              <img src="images/schedule-meeting-icon.svg"\n' +
                                            '                alt="Schedule Meeting Icon" />\n' +
                                            '            </div>\n' +
                                            '            <div class="scheduled-meeting-content">\n' +
                                            '              <h3>' + chatMessage.meetingDetails.meetingTitle + '</h3>\n' +
                                            '              <p>Scheduled Meeting</p>\n' +
                                            '              <span>' + formatDateForMeeting(chatMessage.meetingDetails.meetingDate) + ' &#183; ' + chatMessage.meetingDetails.meetingStartTime + ' - ' + chatMessage.meetingDetails.meetingEndTime + '</span>\n' +
                                            '            </div>\n' +
                                            '          </div>\n' +
                                            '        </div>';
                                    }
                                } else {
                                    if (chatMessage.messageType == 'Normal') {
                                        html += '<div class="message-wrapper grey-color ' + (messageType == "Counterparty" ? "light-gold-color" : "") + '">\n' +
                                            '   <div class="profile-picture">\n' +
                                            '      <img src="' + (chatMessage && chatMessage.messageSenderUser && chatMessage.messageSenderUser.imageUrl ? chatMessage.messageSenderUser.imageUrl : 'images/no-profile-image.jpg') + '" alt="pp">\n' +
                                            '      <p class="name">' + chatMessage.messageSenderUser.firstName + ' ' + chatMessage.messageSenderUser.lastName + '</p>\n' +
                                            '      <p class="last-seen">' + formatDate(chatMessage.createdAt) + '</p>\n' +
                                            '   </div>\n' +
                                            '   <div class="message-content">\n' +
                                            '      <div class="message">' + (chatMessage.message ? chatMessage.message.trim().replaceAll(/\n/g, '<br>') : '') + '</div>\n' +
                                            '   </div>\n' +
                                            '</div>\n';
                                    } else if (chatMessage.messageType == 'Position Confirmation') {
                                        html += '<div class="message-wrapper ' + (chatMessage.with == "Counterparty" && chatMessage.messageStatus != 'Reject' ? "dark-gold-color" : "") + ' ' + (chatMessage.messageStatus == 'Reject' ? "red-color" : "") + '">\n' +
                                            '       <div class="profile-picture">\n' +
                                            '           <img src="' + (chatMessage && chatMessage.messageSenderUser && chatMessage.messageSenderUser.imageUrl ? chatMessage.messageSenderUser.imageUrl : 'images/no-profile-image.jpg') + '" alt="pp">\n' +
                                            '           <p class="name">' + chatMessage.messageSenderUser.firstName + ' ' + chatMessage.messageSenderUser.lastName + '</p>\n' +
                                            '           <p class="last-seen">' + formatDate(chatMessage.createdAt) + '</p>\n' +
                                            '       </div>\n' +
                                            '       <div class="request-row">\n' +
                                            '           <div class="' + (chatMessage.with == "Counterparty" ? "message-content" : "request-content") + '">\n' +
                                            '               <h4>' + (chatMessage.messageStatus == 'None' || chatMessage.messageStatus == 'Updated' ? 'Sent a position confirmation <br/> request' : (chatMessage.messageStatus == 'Approve' ? 'Position confirmation approved' : 'Position confirmation rejected')) + '</h4>\n' +
                                            '               <div class="' + (chatMessage.with == "Counterparty" ? "message" : "content-message") + '">' + (chatMessage.message ? chatMessage.message.trim().replaceAll(/\n/g, '<br>') : '') + '</div>\n' +
                                            '           </div>\n';
                                        if (messageType == 'Counterparty') {
                                            if (chatMessage.from != loggedInUserDetails._id && chatMessage.companyId != loggedInUserDetails.company._id && chatMessage.messageStatus == 'None' && openContractUserDetails.canConfirmPosition) {
                                                html += '        <div class="request-btn">\n' +
                                                    '               <button class="btn btn-primary ' + (chatMessage.with != 'Counterparty' ? "approve-possition" : "reconfirm-approve") + '" data-action="Approve" data-id="' + chatMessage._id + '">Approve</button>\n' +
                                                    '               <button class="btn reject-btn  reconfirm-reject "  data-action="Reject"  data-id="' + chatMessage._id + '">Reject</button>\n' +
                                                    '           </div>\n';
                                            }
                                        } else {
                                            if (chatMessage.from != loggedInUserDetails._id && chatMessage.messageStatus == 'None' && openContractUserDetails.canConfirmPosition) {
                                                html += '        <div class="request-btn">\n' +
                                                    '               <button class="btn btn-primary ' + (chatMessage.with != 'Counterparty' ? "approve-possition" : "reconfirm-approve") + '" data-action="Approve" data-id="' + chatMessage._id + '">Approve</button>\n' +
                                                    '               <button class="btn reject-btn  reconfirm-reject "  data-action="Reject"  data-id="' + chatMessage._id + '">Reject</button>\n' +
                                                    '           </div>\n';
                                            }
                                        }
                                        html += '       </div>\n' +
                                            '</div>\n';
                                        // chatMessage.companyId != loggedInUserInfo.company._id
                                    } else if (chatMessage.messageType == 'Draft Edit Request') {
                                        var userName = chatMessage.messageSenderUser.firstName + " " + chatMessage.messageSenderUser.lastName;
                                        var receiverName = chatMessage.messageReceiverUser.firstName + " " + chatMessage.messageReceiverUser.lastName;
                                        html += '<div class="message-wrapper ' + (chatMessage.with == "Counterparty" && chatMessage.messageStatus != 'Reject' ? "dark-gold-color" : "") + ' ' + (chatMessage.messageStatus == 'Reject' ? "red-color" : "") + '">\n' +
                                            '       <div class="profile-picture">\n' +
                                            '           <img src="' + (chatMessage && chatMessage.messageSenderUser && chatMessage.messageSenderUser.imageUrl ? chatMessage.messageSenderUser.imageUrl : 'images/no-profile-image.jpg') + '" alt="pp">\n' +
                                            '           <p class="name">' + chatMessage.messageSenderUser.firstName + ' ' + chatMessage.messageSenderUser.lastName + '</p>\n' +
                                            '           <p class="last-seen">' + formatDate(chatMessage.createdAt) + '</p>\n' +
                                            '       </div>\n' +
                                            '       <div class="request-row ' + (chatMessage.with == "Counterparty" && chatMessage.messageStatus != 'Reject' ? "dudhiya-color" : "") + '">\n' +
                                            '           <div class="' + (chatMessage.with == "Counterparty" ? "message-content" : "request-content") + '">\n' +
                                            '               <h4>' + (chatMessage.messageStatus == 'None' || chatMessage.messageStatus == 'Updated' ? 'Draft contract request' : (chatMessage.messageStatus == 'Approve' ? 'Draft contract request approved' : 'Draft contract request rejected')) + '</h4>\n' +
                                            '               <div class="' + (chatMessage.with == "Counterparty" ? "message" : "content-message") + '">\n' +
                                            '                   <p>Draft Request: ' + (chatMessage.message ? chatMessage.message.trim().replaceAll(/\n/g, '<br>') : '') + '</p>\n' +
                                            '                   <p>Note: ' + userName.trim() + ' has requested to give contract draft edit request to ' + receiverName.trim() + '. Please take any action on it</p>\n' +
                                            '               </div>\n' +
                                            '           </div>\n';
                                        if (loggedInUserDetails.role == "Contract Creator" && chatMessage.messageStatus == 'None' && openContractUserDetails.canConfirmPosition) {
                                            html += '        <div class="request-btn">\n' +
                                                '               <button class="btn btn-primary draft-request-approve" data-action="Approve" data-id="' + chatMessage._id + '" >Approve</button>\n' +
                                                '               <button class="btn reject-btn  draft-request-reject " data-action="Reject"  data-id="' + chatMessage._id + '" >Reject</button>\n' +
                                                '           </div>\n';
                                        }
                                        html += '       </div>\n' +
                                            '</div>\n';
                                    } else if (chatMessage.messageType == 'Draft Confirmation') {
                                        html += '<div class="message-wrapper ' + (chatMessage.with == "Counterparty" && chatMessage.messageStatus != 'Reject' ? "dark-gold-color" : "") + ' ' + (chatMessage.messageStatus == 'Reject' ? "red-color" : "") + '">\n' +
                                            '       <div class="profile-picture">\n' +
                                            '           <img src="' + (chatMessage && chatMessage.messageSenderUser && chatMessage.messageSenderUser.imageUrl ? chatMessage.messageSenderUser.imageUrl : 'images/no-profile-image.jpg') + '" alt="pp">\n' +
                                            '           <p class="name">' + chatMessage.messageSenderUser.firstName + ' ' + chatMessage.messageSenderUser.lastName + '</p>\n' +
                                            '           <p class="last-seen">' + formatDate(chatMessage.createdAt) + '</p>\n' +
                                            '       </div>\n' +
                                            '       <div class="request-row">\n' +
                                            '           <div class="' + (chatMessage.with == "Counterparty" ? "message-content" : "request-content") + '">\n' +
                                            '               <h4>' + (chatMessage.messageStatus == 'None' || chatMessage.messageStatus == 'Updated' ? 'Draft confirmation request' : (chatMessage.messageStatus == 'Approve' ? 'Draft confirmation approved' : 'Draft confirmation rejected')) + '</h4>\n' +
                                            '               <div class="' + (chatMessage.with == "Counterparty" ? "message" : "content-message") + '">' + (chatMessage.message ? chatMessage.message.trim().replaceAll(/\n/g, '<br>') : '') + '</div>\n' +
                                            '           </div>\n';
                                        if (chatMessage.from != loggedInUserDetails._id && chatMessage.messageStatus == 'None' && openContractUserDetails.canConfirmPosition && (loggedInUserDetails.role == 'Contract Creator' || loggedInUserDetails.role == 'Counterparty')) {
                                            html += '        <div class="request-btn">\n' +
                                                '               <button class="btn btn-primary draft-approve" data-action="Approve" data-id="' + chatMessage._id + '" >Approve</button>\n' +
                                                '               <button class="btn reject-btn  draft-reject " data-action="Reject"  data-id="' + chatMessage._id + '" >Reject</button>\n' +
                                                '           </div>\n';
                                        }
                                        html += '       </div>\n' +
                                            '</div>\n';
                                    } else if (chatMessage.messageType == 'Draft Request') {
                                        html += '<div class="message-wrapper ' + (chatMessage.with == "Counterparty" && chatMessage.messageStatus != 'Reject' ? "dark-gold-color" : "") + ' ' + (chatMessage.messageStatus == 'Reject' ? "red-color" : "") + '">\n' +
                                            '       <div class="profile-picture">\n' +
                                            '           <img src="' + (chatMessage && chatMessage.messageSenderUser && chatMessage.messageSenderUser.imageUrl ? chatMessage.messageSenderUser.imageUrl : 'images/no-profile-image.jpg') + '" alt="pp">\n' +
                                            '           <p class="name">' + chatMessage.messageSenderUser.firstName + ' ' + chatMessage.messageSenderUser.lastName + '</p>\n' +
                                            '           <p class="last-seen">' + formatDate(chatMessage.createdAt) + '</p>\n' +
                                            '       </div>\n' +
                                            '       <div class="request-row">\n' +
                                            '           <div class="' + (chatMessage.with == "Counterparty" ? "message-content" : "request-content") + '">\n' +
                                            '               <h4>Draft Request</h4>\n' +
                                            '               <div class="' + (chatMessage.with == "Counterparty" ? "message" : "content-message") + '">' + (chatMessage.message ? chatMessage.message.trim().replaceAll(/\n/g, '<br>') : '') + '</div>\n' +
                                            '           </div>\n';
                                        if (chatMessage.with == 'Our Team' && chatMessage.messageStatus == 'None' && chatMessage.sendTo == null && (loggedInUserDetails.role == 'Contract Creator' || loggedInUserDetails.role == 'Counterparty')) {
                                            html += '        <div class="request-btn">\n' +
                                                '               <button class="btn btn-primary assign-user" data-action="assign-user" data-id="' + chatMessage._id + '">Assign for Drafting</button>\n' +
                                                '           </div>\n';
                                        }
                                        html += '       </div>\n' +
                                            '</div>\n';
                                    } else if (chatMessage.messageType == 'Notification') {
                                        var notificationMessage = '';
                                        var userName = chatMessage.messageSenderUser.firstName + " " + chatMessage.messageSenderUser.lastName;
                                        if (chatMessage.message == 'request_draft_counter') {
                                            notificationMessage = userName.trim() + " has assigned opposite side to draft this contract section";
                                        } else if (chatMessage.message == 'request_draft') {
                                            if (chatMessage && chatMessage.messageReceiverUser) {
                                                var userReceiverName = chatMessage.messageReceiverUser.firstName + " " + chatMessage.messageReceiverUser.lastName;
                                                notificationMessage = userName.trim() + " has assigned " + userReceiverName.trim() + " to draft this contract section";
                                            } else {
                                                notificationMessage = userName.trim() + " has assigned a team member to draft this contract section";
                                            }
                                        } else {
                                            notificationMessage = (chatMessage.message ? chatMessage.message.trim().replaceAll(/\n/g, '<br>') : '') + ' ' + userName.trim();
                                        }
                                        html += '<div class="message-wrapper ' + (chatMessage.with == "Counterparty" && chatMessage.messageStatus != 'Reject' ? "dark-gold-color" : "") + ' ' + (chatMessage.messageStatus == 'Reject' ? "red-color" : "") + '">\n' +
                                            '       <div class="profile-picture">\n' +
                                            '           <img src="' + (chatMessage && chatMessage.messageSenderUser && chatMessage.messageSenderUser.imageUrl ? chatMessage.messageSenderUser.imageUrl : 'images/no-profile-image.jpg') + '" alt="pp">\n' +
                                            '           <p class="name">' + chatMessage.messageSenderUser.firstName + ' ' + chatMessage.messageSenderUser.lastName + '</p>\n' +
                                            '           <p class="last-seen">' + formatDate(chatMessage.createdAt) + '</p>\n' +
                                            '       </div>\n' +
                                            '       <div class="request-row">\n' +
                                            '           <strong>' + notificationMessage.replaceAll(/\n/g, '<br>') + '</strong>\n' +
                                            '       </div>\n' +
                                            '</div>\n';
                                    } else if (chatMessage.messageType == 'Invite') {
                                        var inviteMessage = '';
                                        var userName = chatMessage.messageSenderUser.firstName + " " + chatMessage.messageSenderUser.lastName;
                                        if (chatMessage.inviteType == 'Team' && chatMessage.invitedTeamDetails) {
                                            inviteMessage += chatMessage.invitedTeamDetails.teamName;
                                        } else {
                                            var invitedUser = chatMessage.invitedUserDetails.firstName + " " + chatMessage.invitedUserDetails.lastName;
                                            inviteMessage += invitedUser.trim();
                                        }
                                        inviteMessage += ' ' + chatMessage.message + ' ' + userName.trim() + ' in this contract section';
                                        html += '<div class="message-wrapper ' + (chatMessage.with == "Counterparty" && chatMessage.messageStatus != 'Reject' ? "dark-gold-color" : "") + ' ' + (chatMessage.messageStatus == 'Reject' ? "red-color" : "") + '">\n' +
                                            '       <div class="profile-picture">\n' +
                                            '           <img src="' + (chatMessage && chatMessage.messageSenderUser && chatMessage.messageSenderUser.imageUrl ? chatMessage.messageSenderUser.imageUrl : 'images/no-profile-image.jpg') + '" alt="pp">\n' +
                                            '           <p class="name">' + chatMessage.messageSenderUser.firstName + ' ' + chatMessage.messageSenderUser.lastName + '</p>\n' +
                                            '           <p class="last-seen">' + formatDate(chatMessage.createdAt) + '</p>\n' +
                                            '       </div>\n' +
                                            '       <div class="request-row">\n' +
                                            '           <strong>' + inviteMessage.replaceAll(/\n/g, '<br>') + '</strong>\n' +
                                            '       </div>\n' +
                                            '</div>\n';
                                    } else if (chatMessage.messageType == 'Meeting') {
                                        html += '<div class="scheduled-meeting" data-id="' + chatMessage.meetingId + '">\n' +
                                            '          <div class="scheduled-meeting-inner">\n' +
                                            '            <div class="scheduled-meeting-icon">\n' +
                                            '              <img src="images/schedule-meeting-icon.svg"\n' +
                                            '                alt="Schedule Meeting Icon" />\n' +
                                            '            </div>\n' +
                                            '            <div class="scheduled-meeting-content">\n' +
                                            '              <h3>' + chatMessage.meetingDetails.meetingTitle + '</h3>\n' +
                                            '              <p>Scheduled Meeting</p>\n' +
                                            '              <span>' + formatDateForMeeting(chatMessage.meetingDetails.meetingDate) + ' &#183; ' + chatMessage.meetingDetails.meetingStartTime + ' - ' + chatMessage.meetingDetails.meetingEndTime + '</span>\n' +
                                            '            </div>\n' +
                                            '          </div>\n' +
                                            '        </div>';
                                    }
                                }
                                if (chatNextPage == 1) {
                                    var contentDiv;
                                    if (messageType == 'our') {
                                        contentDiv = document.getElementById("chatArea");
                                        var newElement = document.createElement("div");
                                        newElement.innerHTML = html;
                                        contentDiv.appendChild(newElement);
                                    } else {
                                        contentDiv = document.getElementById("chatCPArea");
                                        var newElement = document.createElement("div");
                                        newElement.innerHTML = html;
                                        contentDiv.appendChild(newElement);
                                    }
                                    // targetDiv.before(html);
                                } else {
                                    if (messageType == 'our') {
                                        var contentDiv = document.getElementById("chatArea");
                                        var newElement = document.createElement("div");
                                        newElement.innerHTML = html;
                                        contentDiv.insertBefore(newElement, contentDiv.firstChild);
                                    } else {
                                        var contentDiv = document.getElementById("chatCPArea");
                                        var newElement = document.createElement("div");
                                        newElement.innerHTML = html;
                                        contentDiv.insertBefore(newElement, contentDiv.firstChild);
                                    }
                                }
                            });

                            var myDiv;
                            if (messageType == 'our') {
                                myDiv = document.getElementById("chatBodyID");
                            } else {
                                myDiv = document.getElementById("chatCPBodyID");
                            }
                            var scrollToOptions = {
                                top: myDiv.scrollHeight,
                                behavior: 'smooth'
                            };
                            if (chatNextPage == 1) {
                                myDiv.scrollTo(scrollToOptions);
                            } else {
                                if (messageType == 'our') {
                                    document.getElementById('chatBodyID').scrollTop = document.getElementById('chatArea').scrollHeight - setLastHeight;
                                } else {
                                    document.getElementById('chatCPBodyID').scrollTop = document.getElementById('chatCPArea').scrollHeight - setLastHeight;
                                }
                            }
                            chatHasNextPage = responseData.data.hasNextPage;
                            chatNextPage = responseData.data.nextPage;
                            document.getElementById('mainLoader').classList.add(displayNoneClass);

                        } else {
                            document.getElementById('mainLoader').classList.add(displayNoneClass);
                        }
                    } else {
                        document.getElementById('mainLoader').classList.add(displayNoneClass);
                    }
                })
                .catch(error => {
                    // Handle any errors
                    console.error('Error:', error);
                    document.getElementById('mainLoader').classList.add(displayNoneClass);
                });
        } catch (error) {
            console.error('Error fetching data:', error);
            document.getElementById('mainLoader').classList.add(displayNoneClass);
        }
    }


    /**
     * @desc Get contract section message for history
     */
    async function getContractSectionMessageHistory() {
        try {
            document.getElementById('mainLoader').classList.remove(displayNoneClass);
            var getContractSectionMessageListUrl = apiBaseUrl + '/contractSection/getContractSectionMessageList/' + selectedThreadID + '/all';
            var queryParam = [];
            // Set sortby created time
            queryParam.push('sort[createdAt]=-1');
            // Set pageSize
            queryParam.push('page=' + chatHistoryNextPage);
            // Set recordLimit
            queryParam.push('limit=' + chatHistoryRecordLimit);
            // Set queryparams
            getContractSectionMessageListUrl += '?' + queryParam.join('&');
            var headers = {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + authToken
            };
            var requestOptions = {
                method: 'GET',
                headers: headers,
            };
            fetch(getContractSectionMessageListUrl, requestOptions)
                .then(response => response.json())
                .then(data => {
                    // Handle the response data
                    var responseData = data;
                    if (responseData && responseData.status == true && responseData.code == 200 && responseData.data) {
                        if (responseData.data.data.length > 0) {
                            var result;
                            if (chatHistoryNextPage == 1) {
                                document.getElementById('chatHistoryArea').innerHTML = '';
                                result = responseData?.data?.data.reverse();
                                var myDiv = document.getElementById("chatHistoryBodyID");
                                var scrollToOptions = {
                                    top: myDiv.scrollHeight,
                                    behavior: 'smooth'
                                };
                                myDiv.scrollTo(scrollToOptions);
                            } else {
                                result = responseData?.data?.data;
                            }
                            var setLastHeight = document.getElementById('chatHistoryArea').scrollHeight;
                            result.forEach((chatMessage) => {
                                var html = '';
                                if (chatMessage.chatWindow == 'Counterparty') {
                                    if (chatMessage.messageType == 'Normal') {
                                        html += '<div class="message-wrapper light-gold-color">\n' +
                                            '       <div class="profile-picture">\n' +
                                            '           <img src="' + (chatMessage && chatMessage.messageSenderUser && chatMessage.messageSenderUser.imageUrl ? chatMessage.messageSenderUser.imageUrl : 'images/no-profile-image.jpg') + '" alt="pp">\n' +
                                            '           <p class="name">' + chatMessage.messageSenderUser.firstName + ' ' + chatMessage.messageSenderUser.lastName + '&nbsp;<small>(' + (chatMessage && chatMessage.messageSenderUser && chatMessage.messageSenderUser.role == 'Counterparty' ? 'Counterparty' : 'Same side') + ')</small>' + '</p>\n' +
                                            '           <p class="last-seen">' + formatDate(chatMessage.createdAt) + '</p>\n' +
                                            '       </div>\n' +
                                            '       <div class="message-content">\n' +
                                            '           <div class="message">' + (chatMessage.message ? chatMessage.message.trim().replaceAll(/\n/g, '<br>') : '') + '</div>\n' +
                                            '       </div>\n' +
                                            '</div>\n';
                                    } else if (chatMessage.messageType == 'Position Confirmation') {
                                        html += '<div class="message-wrapper ' + (chatMessage.messageStatus == 'Reject' ? "red-color" : "dark-gold-color") + '">\n' +
                                            '       <div class="profile-picture">\n' +
                                            '           <img src="' + (chatMessage && chatMessage.messageSenderUser && chatMessage.messageSenderUser.imageUrl ? chatMessage.messageSenderUser.imageUrl : 'images/no-profile-image.jpg') + '" alt="pp">\n' +
                                            '           <p class="name">' + chatMessage.messageSenderUser.firstName + ' ' + chatMessage.messageSenderUser.lastName + '&nbsp;<small>(' + (chatMessage && chatMessage.messageSenderUser && chatMessage.messageSenderUser.role == 'Counterparty' ? 'Counterparty' : 'Same side') + ')</small>' + '</p>\n' +
                                            '           <p class="last-seen">' + formatDate(chatMessage.createdAt) + '</p>\n' +
                                            '       </div>\n' +
                                            '       <div class="request-row">\n' +
                                            '           <div class="' + (chatMessage.chatWindow == "Counterparty" ? "message-content" : "request-content") + '">\n' +
                                            '               <h4>' + (chatMessage.messageStatus == 'None' || chatMessage.messageStatus == 'Updated' ? 'Sent a position confirmation <br/> request' : (chatMessage.messageStatus == 'Approve' ? 'Position confirmation approved' : 'Position confirmation rejected')) + '</h4>\n' +
                                            '               <div class="' + (chatMessage.chatWindow == "Counterparty" ? "message" : "content-message") + '">' + (chatMessage.message ? chatMessage.message.trim().replaceAll(/\n/g, '<br>') : '') + '</div>\n' +
                                            '           </div>\n';
                                        html += '    </div>\n' +
                                            '</div>\n';
                                    } else if (chatMessage.messageType == 'Notification') {
                                        if (chatMessage.message != 'Ignore') {
                                            var notificationMessage;
                                            var userName = chatMessage.messageSenderUser.firstName + " " + chatMessage.messageSenderUser.lastName;
                                            if (chatMessage.message == 'request_draft_counter') {
                                                notificationMessage = userName.trim() + " has assigned opposite side to draft this contract section";
                                            } else if (chatMessage.message == 'request_draft') {
                                                if (chatMessage && chatMessage.messageReceiverUser) {
                                                    var userReceiverName = chatMessage.messageReceiverUser.firstName + " " + chatMessage.messageReceiverUser.lastName;
                                                    notificationMessage = userName.trim() + " has assigned " + userReceiverName.trim() + " to draft this contract section";
                                                } else {
                                                    notificationMessage = userName.trim() + " has assigned a team member to draft this contract section";
                                                }
                                            } else {
                                                notificationMessage = (chatMessage.message ? chatMessage.message.trim().replaceAll(/\n/g, '<br>') : '') + ' ' + userName.trim();
                                            }
                                            html += '<div class="message-wrapper ' + (chatMessage.chatWindow == "Counterparty" ? "light-gold-color" : "") + '">\n' +
                                                '       <div class="profile-picture">\n' +
                                                '           <img src="' + (chatMessage && chatMessage.messageSenderUser && chatMessage.messageSenderUser.imageUrl ? chatMessage.messageSenderUser.imageUrl : 'images/no-profile-image.jpg') + '" alt="pp">\n' +
                                                '           <p class="name">' + chatMessage.messageSenderUser.firstName + ' ' + chatMessage.messageSenderUser.lastName + '&nbsp;<small>(' + (chatMessage && chatMessage.messageSenderUser && chatMessage.messageSenderUser.role == 'Counterparty' ? 'Counterparty' : 'Same side') + ')</small>' + '</p>\n' +
                                                '           <p class="last-seen">' + formatDate(chatMessage.createdAt) + '</p>\n' +
                                                '       </div>\n' +
                                                '       <div class="request-row">\n' +
                                                '           <strong>' + notificationMessage.replaceAll(/\n/g, '<br>') + '</strong>\n' +
                                                '       </div>\n' +
                                                '</div>\n';
                                        }
                                    } else if (chatMessage.messageType == 'Draft Edit Request') {
                                        var userName = chatMessage.messageSenderUser.firstName + " " + chatMessage.messageSenderUser.lastName;
                                        var receiverName = chatMessage.messageReceiverUser.firstName + " " + chatMessage.messageReceiverUser.lastName;
                                        html += '<div class="message-wrapper ' + (chatMessage.messageStatus == 'Reject' ? "red-color" : "dark-gold-color") + '">\n' +
                                            '       <div class="profile-picture">\n' +
                                            '           <img src="' + (chatMessage && chatMessage.messageSenderUser && chatMessage.messageSenderUser.imageUrl ? chatMessage.messageSenderUser.imageUrl : 'images/no-profile-image.jpg') + '" alt="pp">\n' +
                                            '           <p class="name">' + chatMessage.messageSenderUser.firstName + ' ' + chatMessage.messageSenderUser.lastName + '&nbsp;<small>(' + (chatMessage && chatMessage.messageSenderUser && chatMessage.messageSenderUser.role == 'Counterparty' ? 'Counterparty' : 'Same side') + ')</small>' + '</p>\n' +
                                            '           <p class="last-seen">' + formatDate(chatMessage.createdAt) + '</p>\n' +
                                            '       </div>\n' +
                                            '       <div class="request-row ' + (chatMessage.messageStatus == 'None' || chatMessage.messageStatus == 'Updated' ? 'dudhiya-color' : "") + '">\n' +
                                            '           <div class="' + (chatMessage.with == "Counterparty" ? "message-content" : "request-content") + '">\n' +
                                            '               <h4>' + (chatMessage.messageStatus == 'None' || chatMessage.messageStatus == 'Updated' ? 'Draft contract request' : (chatMessage.messageStatus == 'Approve' ? 'Draft contract request approved' : 'Draft contract request rejected')) + '</h4>\n' +
                                            '               <div class="' + (chatMessage.with == "Counterparty" ? "message" : "content-message") + '">\n' +
                                            '                   <p>Draft Request: ' + (chatMessage.message ? chatMessage.message.trim().replaceAll(/\n/g, '<br>') : '') + '</p>\n' +
                                            '                   <p>Note: ' + userName.trim() + ' has requested to give contract draft edit request to ' + receiverName.trim() + '.</p>\n' +
                                            '               </div>\n' +
                                            '           </div>\n';
                                        html += '       </div>\n' +
                                            '</div>\n';
                                    } else if (chatMessage.messageType == 'Draft Confirmation') {
                                        html += '<div class="message-wrapper ' + (chatMessage.messageStatus == 'Reject' ? "red-color" : "dark-gold-color") + '">\n' +
                                            '       <div class="profile-picture">\n' +
                                            '           <img src="' + (chatMessage && chatMessage.messageSenderUser && chatMessage.messageSenderUser.imageUrl ? chatMessage.messageSenderUser.imageUrl : 'images/no-profile-image.jpg') + '" alt="pp">\n' +
                                            '           <p class="name">' + chatMessage.messageSenderUser.firstName + ' ' + chatMessage.messageSenderUser.lastName + '&nbsp;<small>(' + (chatMessage && chatMessage.messageSenderUser && chatMessage.messageSenderUser.role == 'Counterparty' ? 'Counterparty' : 'Same side') + ')</small>' + '</p>\n' +
                                            '           <p class="last-seen">' + formatDate(chatMessage.createdAt) + '</p>\n' +
                                            '       </div>\n' +
                                            '       <div class="request-row">\n' +
                                            '           <div class="' + (chatMessage.chatWindow == "Counterparty" ? "message-content" : "request-content") + '">\n' +
                                            '               <h4>' + (chatMessage.messageStatus == 'None' || chatMessage.messageStatus == 'Updated' ? 'Draft confirmation request' : (chatMessage.messageStatus == 'Approve' ? 'Draft confirmation approved' : 'Draft confirmation rejected')) + '</h4>\n' +
                                            '               <div class="' + (chatMessage.chatWindow == "Counterparty" ? "message" : "content-message") + '">' + (chatMessage.message ? chatMessage.message.trim().replaceAll(/\n/g, '<br>') : '') + '</div>\n' +
                                            '           </div>\n';
                                        html += '    </div>\n' +
                                            '</div>\n';
                                    } else if (chatMessage.messageType == 'Draft Request') {
                                        html += '<div class="message-wrapper ' + (chatMessage.messageStatus == 'Reject' ? "red-color" : "dark-gold-color") + '">\n' +
                                            '       <div class="profile-picture">\n' +
                                            '           <img src="' + (chatMessage && chatMessage.messageSenderUser && chatMessage.messageSenderUser.imageUrl ? chatMessage.messageSenderUser.imageUrl : 'images/no-profile-image.jpg') + '" alt="pp">\n' +
                                            '           <p class="name">' + chatMessage.messageSenderUser.firstName + ' ' + chatMessage.messageSenderUser.lastName + '&nbsp;<small>(' + (chatMessage && chatMessage.messageSenderUser && chatMessage.messageSenderUser.role == 'Counterparty' ? 'Counterparty' : 'Same side') + ')</small>' + '</p>\n' +
                                            '           <p class="last-seen">' + formatDate(chatMessage.createdAt) + '</p>\n' +
                                            '       </div>\n' +
                                            '       <div class="request-row">\n' +
                                            '           <div class="' + (chatMessage.chatWindow == "Counterparty" ? "message-content" : "request-content") + '">\n' +
                                            '               <h4>Draft Request</h4>\n' +
                                            '               <div class="' + (chatMessage.chatWindow == "Counterparty" ? "message" : "content-message") + '">' + (chatMessage.message ? chatMessage.message.trim().replaceAll(/\n/g, '<br>') : '') + '</div>\n' +
                                            '           </div>\n';
                                        html += '    </div>\n' +
                                            '</div>\n';
                                    } else if (chatMessage.messageType == 'Meeting') {
                                        html += '<div class="scheduled-meeting" data-id="' + chatMessage.meetingId + '">\n' +
                                            '          <div class="scheduled-meeting-inner">\n' +
                                            '            <div class="scheduled-meeting-icon">\n' +
                                            '              <img src="images/schedule-meeting-icon.svg"\n' +
                                            '                alt="Schedule Meeting Icon" />\n' +
                                            '            </div>\n' +
                                            '            <div class="scheduled-meeting-content">\n' +
                                            '              <h3>' + chatMessage.meetingDetails.meetingTitle + '</h3>\n' +
                                            '              <p>Scheduled Meeting</p>\n' +
                                            '              <span>' + formatDateForMeeting(chatMessage.meetingDetails.meetingDate) + ' &#183; ' + chatMessage.meetingDetails.meetingStartTime + ' - ' + chatMessage.meetingDetails.meetingEndTime + '</span>\n' +
                                            '            </div>\n' +
                                            '          </div>\n' +
                                            '        </div>';
                                    }
                                } else {
                                    if (chatMessage.messageType == 'Normal') {
                                        html += '<div class="message-wrapper reverse ' + (chatMessage.chatWindow == "Counterparty" ? "light-gold-color" : "") + '">\n' +
                                            '       <div class="profile-picture">\n' +
                                            '           <p class="last-seen">' + formatDate(chatMessage.createdAt) + '</p>\n' +
                                            '           <p class="name">' + chatMessage.messageSenderUser.firstName + ' ' + chatMessage.messageSenderUser.lastName + '&nbsp;<small>(' + (chatMessage && chatMessage.messageSenderUser && chatMessage.messageSenderUser.role == 'Counterparty' ? 'Counterparty' : 'Same side') + ')</small>' + '</p>\n' +
                                            '           <img src="' + (chatMessage && chatMessage.messageSenderUser && chatMessage.messageSenderUser.imageUrl ? chatMessage.messageSenderUser.imageUrl : 'images/no-profile-image.jpg') + '" alt="pp">\n' +
                                            '       </div>\n' +
                                            '       <div class="message-content">\n' +
                                            '           <div class="message">' + (chatMessage.message ? chatMessage.message.trim().replaceAll(/\n/g, '<br>') : '') + '</div>\n' +
                                            '       </div>\n' +
                                            '</div>\n';
                                    } else if (chatMessage.messageType == 'Position Confirmation') {
                                        html += '<div class="message-wrapper reverse ' + (chatMessage.chatWindow == "Counterparty" && chatMessage.messageStatus != 'Reject' ? "dark-gold-color" : "") + ' ' + (chatMessage.messageStatus == 'Reject' ? "red-color" : "") + '">\n' +
                                            '       <div class="profile-picture">\n' +
                                            '           <p class="last-seen">' + formatDate(chatMessage.createdAt) + '</p>\n' +
                                            '           <p class="name">' + chatMessage.messageSenderUser.firstName + ' ' + chatMessage.messageSenderUser.lastName + '&nbsp;<small>(' + (chatMessage && chatMessage.messageSenderUser && chatMessage.messageSenderUser.role == 'Counterparty' ? 'Counterparty' : 'Same side') + ')</small>' + '</p>\n' +
                                            '           <img src="' + (chatMessage && chatMessage.messageSenderUser && chatMessage.messageSenderUser.imageUrl ? chatMessage.messageSenderUser.imageUrl : 'images/no-profile-image.jpg') + '" alt="pp">\n' +
                                            '       </div>\n' +
                                            '       <div class="request-row">\n' +
                                            '           <div class="' + (chatMessage.chatWindow == "Counterparty" ? "message-content" : "request-content") + '">\n' +
                                            '               <h4>' + (chatMessage.messageStatus == 'None' || chatMessage.messageStatus == 'Updated' ? 'Sent a position confirmation <br/> request' : (chatMessage.messageStatus == 'Approve' ? 'Position confirmation approved' : 'Position confirmation rejected')) + '</h4>\n' +
                                            '               <div class="' + (chatMessage.chatWindow == "Counterparty" ? "message" : "content-message") + '">' + (chatMessage.message ? chatMessage.message.trim().replaceAll(/\n/g, '<br>') : '') + '</div>\n' +
                                            '           </div>\n';
                                        html += '    </div>\n' +
                                            '</div>\n';
                                    } else if (chatMessage.messageType == 'Draft Edit Request') {
                                        var userName = chatMessage.messageSenderUser.firstName + " " + chatMessage.messageSenderUser.lastName;
                                        var receiverName = chatMessage.messageReceiverUser.firstName + " " + chatMessage.messageReceiverUser.lastName;
                                        html += '<div class="message-wrapper reverse ' + (chatMessage.with == "Counterparty" && chatMessage.messageStatus != 'Reject' ? "dark-gold-color" : "") + ' ' + (chatMessage.messageStatus == 'Reject' ? "red-color" : "") + '">\n' +
                                            '       <div class="profile-picture">\n' +
                                            '           <p class="last-seen">' + formatDate(chatMessage.createdAt) + '</p>\n' +
                                            '           <p class="name">' + chatMessage.messageSenderUser.firstName + ' ' + chatMessage.messageSenderUser.lastName + '&nbsp;<small>(' + (chatMessage && chatMessage.messageSenderUser && chatMessage.messageSenderUser.role == 'Counterparty' ? 'Counterparty' : 'Same side') + ')</small>' + '</p>\n' +
                                            '           <img src="' + (chatMessage && chatMessage.messageSenderUser && chatMessage.messageSenderUser.imageUrl ? chatMessage.messageSenderUser.imageUrl : 'images/no-profile-image.jpg') + '" alt="pp">\n' +
                                            '       </div>\n' +
                                            '       <div class="request-row ' + (chatMessage.messageStatus == 'None' || chatMessage.messageStatus == 'Updated' ? 'dudhiya-color' : "") + '">\n' +
                                            '           <div class="' + (chatMessage.with == "Counterparty" ? "message-content" : "request-content") + '">\n' +
                                            '               <h4>' + (chatMessage.messageStatus == 'None' || chatMessage.messageStatus == 'Updated' ? 'Draft contract request' : (chatMessage.messageStatus == 'Approve' ? 'Draft contract request approved' : 'Draft contract request rejected')) + '</h4>\n' +
                                            '               <div class="' + (chatMessage.with == "Counterparty" ? "message" : "content-message") + '">\n' +
                                            '                   <p>Draft Request: ' + (chatMessage.message ? chatMessage.message.trim().replaceAll(/\n/g, '<br>') : '') + '</p>\n' +
                                            '                   <p>Note: ' + userName.trim() + ' has requested to give contract draft edit request to ' + receiverName.trim() + '.</p>\n' +
                                            '               </div>\n' +
                                            '           </div>\n';
                                        html += '       </div>\n' +
                                            '</div>\n';
                                    } else if (chatMessage.messageType == 'Draft Confirmation') {
                                        html += '<div class="message-wrapper reverse ' + (chatMessage.with == "Counterparty" && chatMessage.messageStatus != 'Reject' ? "dark-gold-color" : "") + ' ' + (chatMessage.messageStatus == 'Reject' ? "red-color" : "") + '">\n' +
                                            '       <div class="profile-picture">\n' +
                                            '           <p class="last-seen">' + formatDate(chatMessage.createdAt) + '</p>\n' +
                                            '           <p class="name">' + chatMessage.messageSenderUser.firstName + ' ' + chatMessage.messageSenderUser.lastName + '&nbsp;<small>(' + (chatMessage && chatMessage.messageSenderUser && chatMessage.messageSenderUser.role == 'Counterparty' ? 'Counterparty' : 'Same side') + ')</small>' + '</p>\n' +
                                            '           <img src="' + (chatMessage && chatMessage.messageSenderUser && chatMessage.messageSenderUser.imageUrl ? chatMessage.messageSenderUser.imageUrl : 'images/no-profile-image.jpg') + '" alt="pp">\n' +
                                            '       </div>\n' +
                                            '       <div class="request-row">\n' +
                                            '           <div class="' + (chatMessage.with == "Counterparty" ? "message-content" : "request-content") + '">\n' +
                                            '               <h4>' + (chatMessage.messageStatus == 'None' || chatMessage.messageStatus == 'Updated' ? 'Draft confirmation request' : (chatMessage.messageStatus == 'Approve' ? 'Draft confirmation approved' : 'Draft confirmation rejected')) + '</h4>\n' +
                                            '               <div class="' + (chatMessage.with == "Counterparty" ? "message" : "content-message") + '">' + (chatMessage.message ? chatMessage.message.trim().replaceAll(/\n/g, '<br>') : '') + '</div>\n' +
                                            '           </div>\n';
                                        if (chatMessage.from != loggedInUserDetails._id && chatMessage.companyId != loggedInUserDetails.company._id && chatMessage.messageStatus == 'None' && openContractUserDetails.canConfirmPosition && (loggedInUserDetails.role == 'Contract Creator' || loggedInUserDetails.role == 'Counterparty')) {
                                            html += '        <div class="request-btn">\n' +
                                                '               <button class="btn reject-btn  draft-reject " data-action="Reject"  data-id="' + chatMessage._id + '" >Reject</button>\n' +
                                                '               <button class="btn btn-primary draft-approve" data-action="Approve" data-id="' + chatMessage._id + '" >Approve</button>\n' +
                                                '           </div>\n';
                                        }
                                        html += '    </div>\n' +
                                            '</div>\n';
                                    } else if (chatMessage.messageType == 'Draft Request') {
                                        html += '<div class="message-wrapper reverse ' + (messageType == "Counterparty" && chatMessage.messageStatus != 'Reject' ? "dark-gold-color" : "") + ' ' + (chatMessage.messageStatus == 'Reject' ? "red-color" : "") + '">\n' +
                                            '       <div class="profile-picture">\n' +
                                            '           <p class="last-seen">' + formatDate(chatMessage.createdAt) + '</p>\n' +
                                            '           <p class="name">' + chatMessage.messageSenderUser.firstName + ' ' + chatMessage.messageSenderUser.lastName + '&nbsp;<small>(' + (chatMessage && chatMessage.messageSenderUser && chatMessage.messageSenderUser.role == 'Counterparty' ? 'Counterparty' : 'Same side') + ')</small>' + '</p>\n' +
                                            '           <img src="' + (chatMessage && chatMessage.messageSenderUser && chatMessage.messageSenderUser.imageUrl ? chatMessage.messageSenderUser.imageUrl : 'images/no-profile-image.jpg') + '" alt="pp">\n' +
                                            '       </div>\n' +
                                            '       <div class="request-row">\n' +
                                            '           <div class="' + (messageType == "Counterparty" ? "message-content" : "request-content") + '">\n' +
                                            '               <h4>Draft Request</h4>\n' +
                                            '               <div class="' + (messageType == "Counterparty" ? "message" : "content-message") + '">' + (chatMessage.message ? chatMessage.message.trim().replaceAll(/\n/g, '<br>') : '') + '</div>\n' +
                                            '           </div>\n';
                                        if (chatMessage.with == 'Our Team' && chatMessage.messageStatus == 'None' && chatMessage.sendTo == null && (loggedInUserDetails.role == 'Contract Creator' || loggedInUserDetails.role == 'Counterparty')) {
                                            html += '        <div class="request-btn">\n' +
                                                '               <button class="btn btn-primary assign-user" data-action="assign-user" data-id$*="' + chatMessage._id + '">Assign for Drafting</button>\n' +
                                                '           </div>\n';
                                        }
                                        html += '    </div>\n' +
                                            '</div>\n';
                                    } else if (chatMessage.messageType == 'Notification') {
                                        var notificationMessage;
                                        var userName = chatMessage.messageSenderUser.firstName + " " + chatMessage.messageSenderUser.lastName;
                                        if (chatMessage.message == 'request_draft_counter') {
                                            notificationMessage = userName.trim() + " has assigned opposite side to draft this contract section";
                                        } else if (chatMessage.message == 'request_draft') {
                                            if (chatMessage && chatMessage.messageReceiverUser) {
                                                var userReceiverName = chatMessage.messageReceiverUser.firstName + " " + chatMessage.messageReceiverUser.lastName;
                                                notificationMessage = userName.trim() + " has assigned " + userReceiverName.trim() + " to draft this contract section";
                                            } else {
                                                notificationMessage = userName.trim() + " has assigned a team member to draft this contract section";
                                            }
                                        } else {
                                            notificationMessage = chatMessage.message + ' ' + userName.trim();
                                        }
                                        html += '<div class="message-wrapper reverse ' + (chatMessage.chatWindow == "Counterparty" ? "light-gold-color" : "") + '">\n' +
                                            '       <div class="profile-picture">\n' +
                                            '           <p class="last-seen">' + formatDate(chatMessage.createdAt) + '</p>\n' +
                                            '           <p class="name">' + chatMessage.messageSenderUser.firstName + ' ' + chatMessage.messageSenderUser.lastName + '&nbsp;<small>(' + (chatMessage && chatMessage.messageSenderUser && chatMessage.messageSenderUser.role == 'Counterparty' ? 'Counterparty' : 'Same side') + ')</small>' + '</p>\n' +
                                            '           <img src="' + (chatMessage && chatMessage.messageSenderUser && chatMessage.messageSenderUser.imageUrl ? chatMessage.messageSenderUser.imageUrl : 'images/no-profile-image.jpg') + '" alt="pp">\n' +
                                            '       </div>\n' +
                                            '       <div class="request-row">\n' +
                                            '           <strong>' + notificationMessage.replaceAll(/\n/g, '<br>') + '</strong>\n' +
                                            '       </div>\n' +
                                            '</div>\n';
                                    } else if (chatMessage.messageType == 'Invite') {
                                        var inviteMessage = '';
                                        var userName = chatMessage.messageSenderUser.firstName + " " + chatMessage.messageSenderUser.lastName;
                                        if (chatMessage.inviteType == 'Team' && chatMessage.invitedTeamDetails) {
                                            inviteMessage += chatMessage.invitedTeamDetails.teamName;
                                        } else {
                                            var invitedUser = chatMessage.invitedUserDetails.firstName + " " + chatMessage.invitedUserDetails.lastName;
                                            inviteMessage += invitedUser.trim();
                                        }
                                        inviteMessage += ' ' + chatMessage.message + ' ' + userName.trim() + ' in this contract section';
                                        html += '<div class="message-wrapper reverse">\n' +
                                            '       <div class="profile-picture">\n' +
                                            '           <p class="last-seen">' + formatDate(chatMessage.createdAt) + '</p>\n' +
                                            '           <p class="name">' + userName.trim() + '&nbsp;<small>(' + (chatMessage && chatMessage.messageSenderUser && chatMessage.messageSenderUser.role == 'Counterparty' ? 'Counterparty' : 'Same side') + ')</small>' + '</p>\n' +
                                            '           <img src="' + (chatMessage && chatMessage.messageSenderUser && chatMessage.messageSenderUser.imageUrl ? chatMessage.messageSenderUser.imageUrl : 'images/no-profile-image.jpg') + '" alt="pp">\n' +
                                            '       </div>\n' +
                                            '       <div class="request-row">\n' +
                                            '           <strong>' + inviteMessage + '</strong>\n' +
                                            '       </div>\n' +
                                            '</div>\n';
                                    } else if (chatMessage.messageType == 'Meeting') {
                                        html += '<div class="scheduled-meeting" data-id="' + chatMessage.meetingId + '">\n' +
                                            '          <div class="scheduled-meeting-inner">\n' +
                                            '            <div class="scheduled-meeting-icon">\n' +
                                            '              <img src="images/schedule-meeting-icon.svg"\n' +
                                            '                alt="Schedule Meeting Icon" />\n' +
                                            '            </div>\n' +
                                            '            <div class="scheduled-meeting-content">\n' +
                                            '              <h3>' + chatMessage.meetingDetails.meetingTitle + '</h3>\n' +
                                            '              <p>Scheduled Meeting</p>\n' +
                                            '              <span>' + formatDateForMeeting(chatMessage.meetingDetails.meetingDate) + ' &#183; ' + chatMessage.meetingDetails.meetingStartTime + ' - ' + chatMessage.meetingDetails.meetingEndTime + '</span>\n' +
                                            '            </div>\n' +
                                            '          </div>\n' +
                                            '        </div>';
                                    }
                                }
                                if (chatHistoryNextPage == 1) {
                                    var contentDiv = document.getElementById("chatHistoryArea");
                                    var newElement = document.createElement("div");
                                    newElement.innerHTML = html;
                                    contentDiv.appendChild(newElement);
                                    // targetDiv.before(html);
                                } else {
                                    var contentDiv = document.getElementById("chatHistoryArea");
                                    var newElement = document.createElement("div");
                                    newElement.innerHTML = html;
                                    contentDiv.insertBefore(newElement, contentDiv.firstChild);
                                }
                            })
                            var myDiv = document.getElementById("chatHistoryBodyID");
                            var scrollToOptions = {
                                top: myDiv.scrollHeight,
                                behavior: 'smooth'
                            };
                            if (chatHistoryNextPage == 1) {
                                myDiv.scrollTo(scrollToOptions);
                            } else {
                                document.getElementById('chatHistoryBodyID').scrollTop = document.getElementById('chatHistoryArea').scrollHeight - setLastHeight;
                            }
                            chatHistoryHasNextPage = responseData.data.hasNextPage;
                            chatHistoryNextPage = responseData.data.nextPage;
                            document.getElementById('mainLoader').classList.add(displayNoneClass);
                        } else {
                            document.getElementById('chatHistoryArea').innerHTML = '';
                            document.getElementById('mainLoader').classList.add(displayNoneClass);
                            document.getElementById('mainLoader').classList.add(displayNoneClass);
                        }
                    } else {
                        document.getElementById('mainLoader').classList.add(displayNoneClass);
                    }
                })
                .catch(error => {
                    // Handle any errors
                    console.error('Error:', error);
                    document.getElementById('mainLoader').classList.add(displayNoneClass);
                });
        } catch (error) {
            console.error('Error fetching data:', error);
            document.getElementById('mainLoader').classList.add(displayNoneClass);
        }
    }

    /**
     * @desc Invite users in contract section
     */
    async function inviteMembersInContractSection(socket) {
        try {
            document.getElementById('mainLoader').classList.remove(displayNoneClass);
            var postInviteUserSelect = [];
            inviteUserSelect.forEach((el) => {
                postInviteUserSelect.push(el.itemId)
            });
            var data = JSON.stringify({ "selectedMemberToInvite": postInviteUserSelect });
            var inviteMembersInContractSectionUrl = apiBaseUrl + '/contractSection/inviteMembersInContractSection/' + selectedThreadID + '/user';
            var headers = {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + authToken
            };
            var requestOptions = {
                method: 'POST',
                headers: headers,
                body: data
            };
            fetch(inviteMembersInContractSectionUrl, requestOptions)
                .then(response => response.json())
                .then(data => {
                    inviteUserSelect.forEach((el) => {
                        var inviteMessage = {
                            "contractId": documentID,
                            "contractSectionId": selectedThreadID,
                            "message": "invited by",
                            "with": withType,
                            "messageType": 'Invite',
                            "companyId": loggedInUserDetails.company._id,
                            "oppositeCompanyId": counterPartyCustomerDetail && counterPartyCustomerDetail.company._id ? counterPartyCustomerDetail.company._id : null,
                            "threadID": selectedCommentThereadID,
                            "status": 'None',
                            "actionperformedbyUser": loggedInUserDetails.firstName + " " + loggedInUserDetails.lastName,
                            "actionperformedbyUserImage": loggedInUserDetails.imageUrl,
                            "actionperformedbyUserRole": loggedInUserDetails.role,
                            "messageConfirmationFor": messageConfirmationFor,
                            "invitedUserName": el.itemName,
                            "chatRoomName": getChatRoom(withType),
                        };
                        socket.emit('contract_section_message', inviteMessage);

                        var generalChatData = inviteMessage;
                        var conversationType = 'OTM';
                        if (loggedInUserDetails.company._id.toString() == openContractUserDetails.openContractDetails.companyId.toString() && generalChatData.with == "Our Team") {
                            conversationType = 'OTCC';
                        } else if (loggedInUserDetails.company._id.toString() == openContractUserDetails.openContractDetails.counterPartyCompanyId.toString() && generalChatData.with == "Our Team") {
                            conversationType = 'OTCP';
                        }
                        generalChatData.chatRoomName = 'conversion_history_' + selectedCommentThereadID;
                        generalChatData.conversationType = conversationType;
                        socket.emit('conversion_history_message', generalChatData);

                        var data = {
                            chatRoomName: documentID,
                            usertype: withType
                        };
                        socket.emit('invite_clause', data);

                        var html = '';
                        html += '<strong class="message-wrapper reverse ' + (inviteMessage.with == "Counterparty" ? "light-gold-color" : "") + ' ">\n' +
                            '   <div class="profile-picture">\n' +
                            '      <p class="last-seen">' + formatDate(new Date()) + '</p>\n' +
                            '      <p class="name">' + inviteMessage.actionperformedbyUser + '</p>\n' +
                            '      <img src="' + (inviteMessage.actionperformedbyUserImage ? inviteMessage.actionperformedbyUserImage : 'images/no-profile-image.jpg') + '" alt="pp">\n' +
                            '   </div>\n' +
                            '   <strong>\n' + inviteMessage.invitedUserName.trim() + " invited by " + inviteMessage.actionperformedbyUser.trim() + " in this contract section" + '</strong>\n' +
                            '</div>\n';

                        if (inviteMessage.with == "Counterparty") {
                            var contentDiv = document.getElementById("chatCPArea");
                            var newElement = document.createElement("div");
                            newElement.innerHTML = html;
                            contentDiv.appendChild(newElement);

                            var myDiv = document.getElementById("chatCPBodyID");
                            var scrollToOptions = {
                                top: myDiv.scrollHeight,
                                behavior: 'smooth'
                            };
                            myDiv.scrollTo(scrollToOptions);
                        } else {
                            var contentDiv = document.getElementById("chatArea");
                            var newElement = document.createElement("div");
                            newElement.innerHTML = html;
                            contentDiv.appendChild(newElement);

                            var myDiv = document.getElementById("chatBodyID");
                            var scrollToOptions = {
                                top: myDiv.scrollHeight,
                                behavior: 'smooth'
                            };
                            myDiv.scrollTo(scrollToOptions);
                        }
                    });
                    // Handle the response data
                    document.getElementById('toggleInviteUserTeam').closest("li").classList.remove('active');
                    document.getElementById('inviteUserPopup').classList.add(displayNoneClass);
                    getSelectedContractSectionDetails();
                    inviteUserSelect = [];
                    document.getElementById('mainLoader').classList.add(displayNoneClass);
                    return true;
                })
                .catch(error => {
                    // Handle any errors
                    console.error('Error:', error);
                    document.getElementById('mainLoader').classList.add(displayNoneClass);
                });
        } catch (error) {
            console.error('Error fetching data:', error);
            document.getElementById('mainLoader').classList.add(displayNoneClass);
        }
    }

    /**
     * @desc Invite team in contract section
     */
    async function inviteTeamsInContractSection(socket) {
        try {
            document.getElementById('mainLoader').classList.remove(displayNoneClass);
            var postInviteTeamSelect = [];
            inviteTeamSelect.forEach((el) => {
                postInviteTeamSelect.push(el.itemId)
            });
            var data = JSON.stringify({ "selectedMemberToInvite": postInviteTeamSelect });
            var inviteTeamsInContractSectionUrl = apiBaseUrl + '/contractSection/inviteMembersInContractSection/' + selectedThreadID + '/team';
            var headers = {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + authToken
            };
            var requestOptions = {
                method: 'POST',
                headers: headers,
                body: data
            };
            fetch(inviteTeamsInContractSectionUrl, requestOptions)
                .then(response => response.json())
                .then(data => {
                    inviteTeamSelect.forEach((el) => {
                        var inviteMessage = {
                            "contractId": documentID,
                            "contractSectionId": selectedThreadID,
                            "message": "invited by",
                            "with": withType,
                            "messageType": 'Invite',
                            "companyId": loggedInUserDetails.company._id,
                            "oppositeCompanyId": counterPartyCustomerDetail && counterPartyCustomerDetail.company._id ? counterPartyCustomerDetail.company._id : null,
                            "threadID": selectedCommentThereadID,
                            "status": 'None',
                            "actionperformedbyUser": loggedInUserDetails.firstName + " " + loggedInUserDetails.lastName,
                            "actionperformedbyUserImage": loggedInUserDetails.imageUrl,
                            "actionperformedbyUserRole": loggedInUserDetails.role,
                            "messageConfirmationFor": messageConfirmationFor,
                            "invitedTeamName": el.itemName,
                            "chatRoomName": getChatRoom(withType),
                        };
                        socket.emit('contract_section_message', inviteMessage);

                        var generalChatData = inviteMessage;
                        var conversationType = 'OTM';
                        if (loggedInUserDetails.company._id.toString() == openContractUserDetails.openContractDetails.companyId.toString() && generalChatData.with == "Our Team") {
                            conversationType = 'OTCC';
                        } else if (loggedInUserDetails.company._id.toString() == openContractUserDetails.openContractDetails.counterPartyCompanyId.toString() && generalChatData.with == "Our Team") {
                            conversationType = 'OTCP';
                        }
                        generalChatData.chatRoomName = 'conversion_history_' + selectedCommentThereadID;
                        generalChatData.conversationType = conversationType;
                        socket.emit('conversion_history_message', generalChatData);

                        var html = '';
                        html += '<strong class="message-wrapper reverse ' + (inviteMessage.with == "Counterparty" ? "light-gold-color" : "") + ' ">\n' +
                            '   <div class="profile-picture">\n' +
                            '      <p class="last-seen">' + formatDate(new Date()) + '</p>\n' +
                            '      <p class="name">' + inviteMessage.actionperformedbyUser + '</p>\n' +
                            '      <img src="' + (inviteMessage.actionperformedbyUserImage ? inviteMessage.actionperformedbyUserImage : 'images/no-profile-image.jpg') + '" alt="pp">\n' +
                            '   </div>\n' +
                            '   <strong>\n' + inviteMessage.invitedTeamName.trim() + " invited by " + inviteMessage.actionperformedbyUser.trim() + " in this contract section" + '</strong>\n' +
                            '</div>\n';

                        if (inviteMessage.with == "Counterparty") {
                            var contentDiv = document.getElementById("chatCPArea");
                            var newElement = document.createElement("div");
                            newElement.innerHTML = html;
                            contentDiv.appendChild(newElement);

                            var myDiv = document.getElementById("chatCPBodyID");
                            var scrollToOptions = {
                                top: myDiv.scrollHeight,
                                behavior: 'smooth'
                            };
                            myDiv.scrollTo(scrollToOptions);
                        } else {
                            var contentDiv = document.getElementById("chatArea");
                            var newElement = document.createElement("div");
                            newElement.innerHTML = html;
                            contentDiv.appendChild(newElement);

                            var myDiv = document.getElementById("chatBodyID");
                            var scrollToOptions = {
                                top: myDiv.scrollHeight,
                                behavior: 'smooth'
                            };
                            myDiv.scrollTo(scrollToOptions);
                        }
                    });
                    // Handle the response data
                    document.getElementById('toggleInviteUserTeam').closest("li").classList.remove('active');
                    document.getElementById('inviteTeamPopup').classList.add(displayNoneClass);
                    getSelectedContractSectionDetails();
                    inviteTeamSelect = [];
                    document.getElementById('mainLoader').classList.add(displayNoneClass);
                    return true;
                })
                .catch(error => {
                    // Handle any errors
                    console.error('Error:', error);
                    document.getElementById('mainLoader').classList.add(displayNoneClass);
                });
        } catch (error) {
            console.error('Error fetching data:', error);
            document.getElementById('mainLoader').classList.add(displayNoneClass);
        }
    }

    /**
     * @desc Load Invitation tooltip data
     */
    async function getSelectedContractSectionDetails() {
        try {
            var getContractSectionMessageListUrl = apiBaseUrl + '/contractSection/getSelectedContractSectionDetails/' + selectedCommentThereadID;
            var headers = {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + authToken
            };
            var requestOptions = {
                method: 'GET',
                headers: headers,
            };
            fetch(getContractSectionMessageListUrl, requestOptions)
                .then(response => response.json())
                .then(data => {
                    // Handle the response data
                    var responseData = data;
                    document.getElementById('userTabContent').innerHTML = '';
                    document.getElementById('teamTabContent').innerHTML = '';
                    if (responseData && responseData.data) {
                        selectedContractSectionDetails = responseData.data;
                        document.getElementById('sameSideTypeBox').classList.remove(displayNoneClass);
                        document.getElementById('counterpartyTypeBox').classList.remove(displayNoneClass);
                        // var actionSameSide = document.querySelectorAll('.action-sameside');
                        // actionSameSide.forEach(function (element) {
                        //     element.classList.remove(displayNoneClass);
                        // });
                        // var actionCounterparty = document.querySelectorAll('.action-counterparty');
                        // actionCounterparty.forEach(function (element) {
                        //     element.classList.remove(displayNoneClass);
                        // });
                        var draftConfirmCPElement = document.getElementById("draftConfirmCP");
                        if (draftConfirmCPElement) {
                            draftConfirmCPElement.parentNode.removeChild(draftConfirmCPElement);
                        }
                        var draftConfirmSSElement = document.getElementById("draftConfirmSS");
                        if (draftConfirmSSElement) {
                            draftConfirmSSElement.parentNode.removeChild(draftConfirmSSElement);
                        }
                        document.getElementById('chatBodyID').classList.remove('contract-completed');
                        document.getElementById('chatCPBodyID').classList.remove('contract-completed');
                        var selectedContractSectionDetailsA = responseData.data;
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
                        if (contractCounterpartyDetails) {
                            iHtml += '<li>\n' +
                                '\t\t\t\t<div class="invite-user-inner">\n' +
                                '\t\t\t\t\t\t\t\t<div class="invite-user-icon">\n' +
                                '\t\t\t\t\t\t\t\t\t\t\t\t<img src="' + (contractCounterpartyDetails.userImage ? IMAGE_USER_PATH_LINK + contractCounterpartyDetails.userImage : 'images/no-profile-image.jpg') + '" alt="">\n' +
                                '\t\t\t\t\t\t\t\t</div>\n' +
                                '\t\t\t\t\t\t\t\t<div class="invite-user-name">\n' +
                                '\t\t\t\t\t\t\t\t\t\t\t\t<h3>' + contractCounterpartyDetails.itemName + '</h3>\n' +
                                '\t\t\t\t\t\t\t\t\t\t\t\t<span>' + contractCounterpartyDetails.role + '</span>\n' +
                                '\t\t\t\t\t\t\t\t</div>\n' +
                                '\t\t\t\t</div>\n' +
                                '</li>';
                        }
                        if (responseData.data.contractAssignedUsers && responseData.data.contractAssignedUsers.length > 0) {
                            document.getElementById('toggleSendPositionConfirmation').closest("li").classList.remove(displayNoneClass);
                            responseData.data.contractAssignedUsers.forEach((ele) => {
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
                            document.getElementById('toggleSendPositionConfirmation').closest("li").classList.add(displayNoneClass);
                        }
                        iHtml += '</ul>';
                        document.getElementById('userTabContent').innerHTML = iHtml;
                        if (selectedContractSectionDetailsA && selectedContractSectionDetailsA.contractSectionData && selectedContractSectionDetailsA.contractSectionData.contractStatus == "Completed") {
                            document.getElementById('sameSideTypeBox').classList.add(displayNoneClass);
                            document.getElementById('counterpartyTypeBox').classList.add(displayNoneClass);
                            var actionSameSide = document.querySelectorAll('.action-sameside');
                            actionSameSide.forEach(function (element) {
                                element.classList.add(displayNoneClass);
                            });
                            var actionCounterparty = document.querySelectorAll('.action-counterparty');
                            actionCounterparty.forEach(function (element) {
                                element.classList.add(displayNoneClass);
                            });
                            html = '<div class="chat-typing-area" id="draftConfirmCP">\n' +
                                '   <div class="position-text">' + selectedContractSectionDetailsA.contractSectionData.draftConfirmMessage + " " + selectedContractSectionDetailsA.contractSectionData.confirmByCounterPartyId.firstName + " " + selectedContractSectionDetailsA.contractSectionData.confirmByCounterPartyId.lastName + " and " + selectedContractSectionDetailsA.contractSectionData.confirmByUserId.firstName + " " + selectedContractSectionDetailsA.contractSectionData.confirmByUserId.lastName + '</div>\n' +
                                '</div>';
                            var contentDiv = document.getElementById("chatContractCounterpartyFooter");
                            var newElement = document.createElement("div");
                            newElement.innerHTML = html;
                            contentDiv.appendChild(newElement);
                            // console.log('loggedinuser', loggedInUserDetails);
                            htmlA = '';
                            htmlA += '<div class="chat-typing-area" id="draftConfirmSS">\n' +
                                '   <div class="position-text">' + selectedContractSectionDetailsA.contractSectionData.draftConfirmMessage + " " + selectedContractSectionDetailsA.contractSectionData.confirmByCounterPartyId.firstName + " " + selectedContractSectionDetailsA.contractSectionData.confirmByCounterPartyId.lastName + " and " + selectedContractSectionDetailsA.contractSectionData.confirmByUserId.firstName + " " + selectedContractSectionDetailsA.contractSectionData.confirmByUserId.lastName + '</div>\n';
                            if (loggedInUserDetails.role == "Contract Creator" || loggedInUserDetails.role == "Counterparty") {
                                htmlA += '   <div class="btn-box btn-box-re-open"><button class="btn-primary btn">Re-Open</button></div>\n';
                            }
                            htmlA += '</div>';
                            var contentDiv = document.getElementById("chatContractSameSideFooter");
                            var newElement = document.createElement("div");
                            newElement.innerHTML = htmlA;
                            contentDiv.appendChild(newElement);

                            document.getElementById('chatBodyID').classList.add('contract-completed');
                            document.getElementById('chatCPBodyID').classList.add('contract-completed');
                        }

                        if (responseData.data.contractAssignedTeams && responseData.data.contractAssignedTeams.length > 0) {
                            var iHtml = '<ul>';
                            responseData.data.contractAssignedTeams.forEach((ele) => {
                                iHtml += '<li>\n' +
                                    '\t\t\t\t<div class="invite-user-inner">\n' +
                                    '\t\t\t\t\t\t\t\t<div class="invite-user-name">\n' +
                                    '\t\t\t\t\t\t\t\t\t\t\t\t<h3>' + ele.teamName + '</h3>\n' +
                                    '\t\t\t\t\t\t\t\t</div>\n' +
                                    '\t\t\t\t</div>\n' +
                                    '</li>';
                            });
                            iHtml += '</ul>';
                            document.getElementById('teamTabContent').innerHTML = iHtml;
                        } else {
                            var html = '<ul>' +
                                '<li><p>No team selected</p></li>' +
                                '</ul>';
                            document.getElementById('teamTabContent').innerHTML = html;
                        }
                        return selectedContractSectionDetailsA;
                    } else {
                        var htmlA = '<ul>' +
                            '<li><p>No user selected</p></li>' +
                            '</ul>';
                        document.getElementById('userTabContent').innerHTML = htmlA;

                        var htmlB = '<ul>' +
                            '<li><p>No team selected</p></li>' +
                            '</ul>';
                        document.getElementById('teamTabContent').innerHTML = htmlB;
                    }
                })
                .catch(error => {
                    // Handle any errors
                    console.error('Error:', error);
                });
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    /**
     * @param postData
     * @param socket
     * @returns {Promise<void>}
     */
    async function submitPositionConfirmation(postData, socket) {
        try {
            document.getElementById('mainLoader').classList.remove(displayNoneClass);
            var data = JSON.stringify(postData);
            var addContractSectionMessageUrl = apiBaseUrl + '/contractSection/addContractSectionMessage';
            var headers = {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + authToken
            };
            var requestOptions = {
                method: 'POST',
                headers: headers,
                body: data
            };
            fetch(addContractSectionMessageUrl, requestOptions)
                .then(response => response.json())
                .then(data => {
                    // Handle the response data
                    document.getElementById("frmSendPositionConfirmation").reset();
                    document.getElementById("frmSendDraftConfirmation").reset();
                    var responseData = data;
                    if (responseData && responseData.status == true && responseData.code == 200) {
                        postData._id = responseData.data._id;
                        socket.emit('contract_section_message', postData);
                        var generalChatData = postData;
                        var conversationType = 'OTM';
                        if (loggedInUserDetails.company._id.toString() == openContractUserDetails.openContractDetails.companyId.toString() && postData.with == "Our Team") {
                            conversationType = 'OTCC';
                        } else if (loggedInUserDetails.company._id.toString() == openContractUserDetails.openContractDetails.counterPartyCompanyId.toString() && postData.with == "Our Team") {
                            conversationType = 'OTCP';
                        }
                        generalChatData.chatRoomName = 'conversion_history_' + selectedCommentThereadID;
                        generalChatData.conversationType = conversationType;
                        socket.emit('conversion_history_message', generalChatData);

                        var html = '';
                        if (postData.messageType == 'Position Confirmation') {
                            html += '<div class="message-wrapper reverse ' + (postData.with == "Counterparty" ? "dark-gold-color" : "") + '">\n' +
                                '       <div class="profile-picture">\n' +
                                '           <p class="last-seen">' + formatDate(new Date()) + '</p>\n' +
                                '           <p class="name">' + postData.actionperformedbyUser + '</p>\n' +
                                '           <img src="' + (postData.actionperformedbyUserImage ? postData.actionperformedbyUserImage : 'images/no-profile-image.jpg') + '" alt="pp">\n' +
                                '       </div>\n' +
                                '       <div class="request-row">\n' +
                                '           <div class="' + (postData.with == "Counterparty" ? "message-content" : "request-content") + '">\n' +
                                '               <h4>' + 'Sent a position confirmation <br/> request' + '</h4>\n' +
                                '               <div class="' + (postData.with == "Counterparty" ? "message" : "content-message") + '">' + (postData.message ? postData.message.trim().replaceAll(/\n/g, '<br>') : '') + '</div>\n' +
                                '           </div>\n';
                            html += '    </div>\n' +
                                '</div>\n';
                        } else if (postData.messageType == 'Draft Confirmation') {
                            html += '<div class="message-wrapper reverse ' + (postData.with == "Counterparty" ? "dark-gold-color" : "") + '">\n' +
                                '       <div class="profile-picture">\n' +
                                '           <p class="last-seen">' + formatDate(new Date()) + '</p>\n' +
                                '           <p class="name">' + postData.actionperformedbyUser + '</p>\n' +
                                '           <img src="' + (postData.actionperformedbyUserImage ? postData.actionperformedbyUserImage : 'images/no-profile-image.jpg') + '" alt="pp">\n' +
                                '       </div>\n' +
                                '       <div class="request-row">\n' +
                                '           <div class="' + (postData.with == "Counterparty" ? "message-content" : "request-content") + '">\n' +
                                '               <h4>Draft confirmation request</h4>\n' +
                                '               <div class="' + (postData.with == "Counterparty" ? "message" : "content-message") + '">' + (postData.message ? postData.message.trim().replaceAll(/\n/g, '<br>') : '') + '</div>\n' +
                                '           </div>\n';
                            html += '    </div>\n' +
                                '</div>\n';
                            var sDocumentEditingRestrictions = "readOnly";
                            window.Asc.plugin.executeMethod("SetEditingRestrictions", [sDocumentEditingRestrictions]);
                        } else {
                            html += '<div class="message-wrapper reverse ' + (postData.with == "Counterparty" ? "dark-gold-color" : "") + '">\n' +
                                '       <div class="profile-picture">\n' +
                                '           <p class="last-seen">' + formatDate(new Date()) + '</p>\n' +
                                '           <p class="name">' + postData.actionperformedbyUser + '</p>\n' +
                                '           <img src="' + (postData.actionperformedbyUserImage ? postData.actionperformedbyUserImage : 'images/no-profile-image.jpg') + '" alt="pp">\n' +
                                '       </div>\n' +
                                '       <div class="request-row">\n' +
                                '           <div class="' + (postData.with == "Counterparty" ? "message-content" : "request-content") + '">\n' +
                                '               <h4>' + 'Draft request' + '</h4>\n' +
                                '               <div class="' + (postData.with == "Counterparty" ? "message" : "content-message") + '">' + (postData.message ? postData.message.trim().replaceAll(/\n/g, '<br>') : '') + '</div>\n' +
                                '           </div>\n';
                            html += '    </div>\n' +
                                '</div>\n';
                        }

                        if (postData.with == "Counterparty") {
                            var contentDiv = document.getElementById("chatCPArea");
                            var newElement = document.createElement("div");
                            newElement.innerHTML = html;
                            contentDiv.appendChild(newElement);

                            var myDiv = document.getElementById("chatCPBodyID");
                            var scrollToOptions = {
                                top: myDiv.scrollHeight,
                                behavior: 'smooth'
                            };
                            myDiv.scrollTo(scrollToOptions);
                        } else {
                            var contentDiv = document.getElementById("chatArea");
                            var newElement = document.createElement("div");
                            newElement.innerHTML = html;
                            contentDiv.appendChild(newElement);

                            var myDiv = document.getElementById("chatBodyID");
                            var scrollToOptions = {
                                top: myDiv.scrollHeight,
                                behavior: 'smooth'
                            };
                            myDiv.scrollTo(scrollToOptions);
                        }
                        document.getElementById('sendPositionConfirmationPopup').classList.add(displayNoneClass);
                        document.getElementById('sendDraftConfirmationPopup').classList.add(displayNoneClass);
                        document.getElementById('mainLoader').classList.add(displayNoneClass);
                        return true;
                    } else {
                        document.getElementById('mainLoader').classList.add(displayNoneClass);
                    }
                })
                .catch(error => {
                    // Handle any errors
                    console.error('Error:', error);
                    document.getElementById('mainLoader').classList.add(displayNoneClass);
                });
        } catch (error) {
            console.error('Error fetching data:', error);
            document.getElementById('mainLoader').classList.add(displayNoneClass);
        }
    }

    /**
     * @param postData
     * @param socket
     * @returns {Promise<void>}
     */
    async function updateContractSectionConfirmationStatus(postData, socket, formName = '') {
        try {
            document.getElementById('mainLoader').classList.remove(displayNoneClass);
            var data = JSON.stringify(postData);
            var updateContractSectionConfirmationStatusUrl = apiBaseUrl + '/contractSection/updateContractSectionConfirmationStatus';
            var headers = {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + authToken
            };
            var requestOptions = {
                method: 'POST',
                headers: headers,
                body: data
            };
            fetch(updateContractSectionConfirmationStatusUrl, requestOptions)
                .then(response => response.json())
                .then(data => {
                    // Handle the response data
                    document.getElementById("frmReconfirmPosition").reset();
                    document.getElementById("frmRejectPosition").reset();
                    document.getElementById("frmAssignDraftRequest").reset();
                    document.getElementById("frmRejectDraft").reset();
                    document.getElementById("frmRejectDarftRequest").reset();

                    var responseData = data;
                    if (responseData && responseData.status == true && responseData.code == 200) {
                        socket.emit('contract_section_message', postData);
                        var generalChatData = postData;
                        var conversationType = 'OTM';
                        if (loggedInUserDetails.company._id.toString() == openContractUserDetails.openContractDetails.companyId.toString() && postData.with == "Our Team") {
                            conversationType = 'OTCC';
                        } else if (loggedInUserDetails.company._id.toString() == openContractUserDetails.openContractDetails.counterPartyCompanyId.toString() && postData.with == "Our Team") {
                            conversationType = 'OTCP';
                        }
                        generalChatData.chatRoomName = 'conversion_history_' + selectedCommentThereadID;
                        generalChatData.conversationType = conversationType;
                        socket.emit('conversion_history_message', generalChatData);
                        var html = '';
                        if (postData.messageType == 'Notification' && postData.confirmationType == 'position') {
                            if (postData.status == 'rejected') {
                                html += '<div class="message-wrapper reverse red-color">\n' +
                                    '   <div class="profile-picture">\n' +
                                    '      <p class="last-seen">' + formatDate(new Date()) + '</p>\n' +
                                    '      <p class="name">' + postData.actionperformedbyUser + '</p>\n' +
                                    '      <img src="' + (postData.actionperformedbyUserImage ? postData.actionperformedbyUserImage : 'images/no-profile-image.jpg') + '" alt="pp">\n' +
                                    '   </div>\n' +
                                    '   <div class="request-row">\n' +
                                    '   <div class="request-content">\n' +
                                    '      <h4>Position confirmation rejected</h4>\n' +
                                    '      <div class="message">' + (postData.message ? postData.message.trim().replaceAll(/\n/g, '<br>') : '') + '</div>\n' +
                                    '   </div>\n' +
                                    '   </div>\n' +
                                    '</div>\n';
                                html += '<div class="message-wrapper reverse ' + (postData.with == "Counterparty" ? "light-gold-color" : "") + '">\n' +
                                    '   <div class="profile-picture">\n' +
                                    '      <p class="last-seen">' + formatDate(new Date()) + '</p>\n' +
                                    '      <p class="name">' + postData.actionperformedbyUser + '</p>\n' +
                                    '      <img src="' + (postData.actionperformedbyUserImage ? postData.actionperformedbyUserImage : 'images/no-profile-image.jpg') + '" alt="pp">\n' +
                                    '   </div>\n' +
                                    '   <div class="request-row">\n' +
                                    '       <strong>Position rejected by ' + postData.actionperformedbyUser + '</strong>\n' +
                                    '   </div>\n' +
                                    '</div>'
                            } else {
                                html += '<div class="message-wrapper reverse ">\n' +
                                    '   <div class="profile-picture">\n' +
                                    '      <p class="last-seen">' + formatDate(new Date()) + '</p>\n' +
                                    '      <p class="name">' + postData.actionperformedbyUser + '</p>\n' +
                                    '      <img src="' + (postData.actionperformedbyUserImage ? postData.actionperformedbyUserImage : 'images/no-profile-image.jpg') + '" alt="pp">\n' +
                                    '   </div>\n' +
                                    '   <div class="request-row">\n' +
                                    '       <strong>Position approved by ' + postData.actionperformedbyUser + '</strong>\n' +
                                    '   </div>\n' +
                                    '</div>'
                            }
                        } else if (postData.messageType == 'Notification' && postData.confirmationType == 'request_draft') {
                            if (postData.sendTo) {
                                html += '<div class="message-wrapper reverse light-gold-color">\n' +
                                    '   <div class="profile-picture">\n' +
                                    '      <p class="last-seen">' + formatDate(new Date()) + '</p>\n' +
                                    '      <p class="name">' + postData.actionperformedbyUser + '</p>\n' +
                                    '      <img src="' + (postData.actionperformedbyUserImage ? postData.actionperformedbyUserImage : 'images/no-profile-image.jpg') + '" alt="pp">\n' +
                                    '   </div>\n' +
                                    '   <div class="request-row">\n' +
                                    '      <strong>' + postData.actionperformedbyUser + ' has assigned a team member to draft this contract section</strong>\n' +
                                    '   </div>\n' +
                                    '</div>';
                                if (postData.messageConfirmationFor != "Same Side") {
                                    html += '<div class="message-wrapper reverse ' + (postData.with == "Counterparty" ? "dark-gold-color" : "") + '">\n' +
                                        '   <div class="profile-picture">\n' +
                                        '      <p class="last-seen">' + formatDate(new Date()) + '</p>\n' +
                                        '      <p class="name">' + postData.actionperformedbyUser + '</p>\n' +
                                        '      <img src="' + (postData.actionperformedbyUserImage ? postData.actionperformedbyUserImage : 'images/no-profile-image.jpg') + '" alt="pp">\n' +
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
                                getOpenContractUserDetails(socket, redirection = false);
                            } else {
                                html += '<div class="message-wrapper reverse ' + (postData.with == "Counterparty" ? "dark-gold-color" : "") + '">\n' +
                                    '   <div class="profile-picture">\n' +
                                    '      <p class="last-seen">' + formatDate(new Date()) + '</p>\n' +
                                    '      <p class="name">' + postData.actionperformedbyUser + '</p>\n' +
                                    '      <img src="' + (postData.actionperformedbyUserImage ? postData.actionperformedbyUserImage : 'images/no-profile-image.jpg') + '" alt="pp">\n' +
                                    '   </div>\n' +
                                    '   <div class="request-row">\n' +
                                    '      <div class="message-content">\n' +
                                    '         <h4>Draft Request</h4>\n' +
                                    '         <div class="message">' + (postData.message ? postData.message.trim().replaceAll(/\n/g, '<br>') : '') + '</div>\n' +
                                    '      </div>\n' +
                                    '   </div>\n' +
                                    '</div>';
                                html += '<div class="message-wrapper reverse ' + (postData.with == "Counterparty" ? "light-gold-color" : "") + ' ">\n' +
                                    '   <div class="profile-picture">\n' +
                                    '      <p class="last-seen">' + formatDate(new Date()) + '</p>\n' +
                                    '      <p class="name">' + postData.actionperformedbyUser + '</p>\n' +
                                    '      <img src="' + (postData.actionperformedbyUserImage ? postData.actionperformedbyUserImage : 'images/no-profile-image.jpg') + '" alt="pp">\n' +
                                    '   </div>\n' +
                                    '   <div class="request-row">\n' +
                                    '      <strong>' + postData.actionperformedbyUser + ' has assigned opposite side to draft this contract section</strong>\n' +
                                    '   </div>\n' +
                                    '</div>';
                            }
                        } else if (postData.messageType == 'Notification' && postData.confirmationType == 'draft_approval') {
                            if (postData.status == 'approved') {
                                html += '<div class="message-wrapper reverse ' + (postData.with == "Counterparty" ? "light-gold-color" : "") + '">\n' +
                                    '   <div class="profile-picture">\n' +
                                    '      <p class="last-seen">' + formatDate(new Date()) + '</p>\n' +
                                    '      <p class="name">' + postData.actionperformedbyUser + '</p>\n' +
                                    '      <img src="' + (postData.actionperformedbyUserImage ? postData.actionperformedbyUserImage : 'images/no-profile-image.jpg') + '" alt="pp">\n' +
                                    '   </div>\n' +
                                    '   <div class="request-row">\n' +
                                    '      <strong>Draft contract request approved by ' + postData.actionperformedbyUser + '</strong>\n' +
                                    '   </div>\n' +
                                    '</div>\n';
                                getOpenContractUserDetails(socket, redirection = false);
                            } else if (postData.status == 'rejected') {
                                html += '<div class="message-wrapper reverse red-color">\n' +
                                    '   <div class="profile-picture">\n' +
                                    '      <p class="last-seen">' + formatDate(new Date()) + '</p>\n' +
                                    '      <p class="name">' + postData.actionperformedbyUser + '</p>\n' +
                                    '      <img src="' + (postData.actionperformedbyUserImage ? postData.actionperformedbyUserImage : 'images/no-profile-image.jpg') + '" alt="pp">\n' +
                                    '   </div>\n' +
                                    '   <div class="request-row ">\n' +
                                    '      <div class="message-content">\n' +
                                    '         <h4>Draft contract request rejected</h4>\n' +
                                    '         <div class="message">\n' +
                                    '            <p>Draft Request: ' + (postData.message ? postData.message.trim().replaceAll(/\n/g, '<br>') : '') + '</p>\n' +
                                    '            <p>Note: ' + postData.actionperformedbyUser + ' has requested to give contract draft edit request to opposite user.</p>\n' +
                                    '         </div>\n' +
                                    '      </div>\n' +
                                    '   </div>\n' +
                                    '</div>';
                                html += '<div class="message-wrapper reverse ' + (postData.with == "Counterparty" ? "light-gold-color" : "") + '">\n' +
                                    '   <div class="profile-picture">\n' +
                                    '      <p class="last-seen">' + formatDate(new Date()) + '</p>\n' +
                                    '      <p class="name">' + postData.actionperformedbyUser + '</p>\n' +
                                    '      <img src="' + (postData.actionperformedbyUserImage ? postData.actionperformedbyUserImage : 'images/no-profile-image.jpg') + '" alt="pp">\n' +
                                    '   </div>\n' +
                                    '   <div class="request-row">\n' +
                                    '      <strong>Draft contract request rejected by ' + postData.actionperformedbyUser + '</strong>\n' +
                                    '   </div>\n' +
                                    '</div>\n';
                            } else {
                                html += '<div class="message-wrapper reverse  red-color">\n' +
                                    '   <div class="profile-picture">\n' +
                                    '      <p class="last-seen">' + formatDate(new Date()) + '</p>\n' +
                                    '      <p class="name">' + postData.actionperformedbyUser + '</p>\n' +
                                    '      <img src="' + (postData.actionperformedbyUserImage ? postData.actionperformedbyUserImage : 'images/no-profile-image.jpg') + '" alt="pp">\n' +
                                    '   </div>\n' +
                                    '   <div class="request-row ">\n' +
                                    '      <div class="message-content">\n' +
                                    '         <h4>Draft contract request rejected</h4>\n' +
                                    '         <div class="message">\n' +
                                    '            <p>Draft Request: ' + (postData.message ? postData.message.trim().replaceAll(/\n/g, '<br>') : '') + '</p>\n' +
                                    '            <p>Note: ' + postData.actionperformedbyUser + ' has requested to give contract draft edit request to Internal User.</p>\n' +
                                    '         </div>\n' +
                                    '      </div>\n' +
                                    '   </div>\n' +
                                    '</div>';
                                html += '<div class="message-wrapper reverse ' + (postData.with == "Counterparty" ? "light-gold-color" : "") + '">\n' +
                                    '   <div class="profile-picture">\n' +
                                    '      <p class="last-seen">' + formatDate(new Date()) + '</p>\n' +
                                    '      <p class="name">' + postData.actionperformedbyUser + '</p>\n' +
                                    '      <img src="' + (postData.actionperformedbyUserImage ? postData.actionperformedbyUserImage : 'images/no-profile-image.jpg') + '" alt="pp">\n' +
                                    '   </div>\n' +
                                    '   <div class="request-row">\n' +
                                    '      <strong>' + postData.actionperformedbyUser + ' has assigned Fillps SameSide to draft this contract section</strong>\n' +
                                    '   </div>\n' +
                                    '</div>\n';
                            }
                        } else if (postData.messageType == 'Notification' && postData.confirmationType == 'draft') {
                            if (postData.status == 'approved') {
                                if (postData.chatWindow !== "Our Team") {
                                    document.getElementById('chatCPBodyID').classList.add('contract-completed');
                                    document.getElementById('chatBodyID').classList.add('contract-completed');
                                    document.getElementById('sameSideTypeBox').classList.add(displayNoneClass);
                                    document.getElementById('counterpartyTypeBox').classList.add(displayNoneClass);
                                    var actionSameSide = document.querySelectorAll('.action-sameside');
                                    actionSameSide.forEach(function (element) {
                                        element.classList.add(displayNoneClass);
                                    });
                                    var actionCounterparty = document.querySelectorAll('.action-counterparty');
                                    actionCounterparty.forEach(function (element) {
                                        element.classList.add(displayNoneClass);
                                    });
                                }
                                html += '<div class="message-wrapper reverse ' + (postData.with == "Counterparty" ? "light-gold-color" : "") + '">\n' +
                                    '   <div class="profile-picture">\n' +
                                    '      <p class="last-seen">' + formatDate(new Date()) + '</p>\n' +
                                    '      <p class="name">' + postData.actionperformedbyUser + '</p>\n' +
                                    '      <img src="' + (postData.actionperformedbyUserImage ? postData.actionperformedbyUserImage : 'images/no-profile-image.jpg') + '" alt="pp">\n' +
                                    '   </div>\n' +
                                    '   <div class="request-row">\n' +
                                    '      <strong>Draft confirmation request approved by ' + postData.actionperformedbyUser + '</strong>\n' +
                                    '   </div>\n' +
                                    '</div>\n';
                                getSelectedContractSectionDetails();
                                getOpenContractUserDetails(socket, redirection = false);
                            } else {
                                html += '<div class="message-wrapper reverse red-color">\n' +
                                    '   <div class="profile-picture">\n' +
                                    '      <p class="last-seen">' + formatDate(new Date()) + '</p>\n' +
                                    '      <p class="name">' + postData.actionperformedbyUser + '</p>\n' +
                                    '      <img src="' + (postData.actionperformedbyUserImage ? postData.actionperformedbyUserImage : 'images/no-profile-image.jpg') + '" alt="pp">\n' +
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
                                html += '<div class="message-wrapper reverse ' + (postData.with == "Counterparty" ? "light-gold-color" : "") + '">\n' +
                                    '   <div class="profile-picture">\n' +
                                    '      <p class="last-seen">' + formatDate(new Date()) + '</p>\n' +
                                    '      <p class="name">' + postData.actionperformedbyUser + '</p>\n' +
                                    '      <img src="' + (postData.actionperformedbyUserImage ? postData.actionperformedbyUserImage : 'images/no-profile-image.jpg') + '" alt="pp">\n' +
                                    '   </div>\n' +
                                    '   <div class="request-row">\n' +
                                    '      <strong>Draft confirmation request rejected by ' + postData.actionperformedbyUser + '</strong>\n' +
                                    '   </div>\n' +
                                    '</div>\n';

                                getSelectedContractSectionDetails();
                                getOpenContractUserDetails(socket, redirection = false);
                            }
                        } else if (postData.messageType == 'Notification' && postData.confirmationType == 'assign_draft') {
                            html += '<div class="message-wrapper reverse ' + (postData.with == "Counterparty" ? "light-gold-color" : "") + '">\n' +
                                '   <div class="profile-picture">\n' +
                                '      <p class="last-seen">' + formatDate(new Date()) + '</p>\n' +
                                '      <p class="name">' + postData.actionperformedbyUser + '</p>\n' +
                                '      <img src="' + (postData.actionperformedbyUserImage ? postData.actionperformedbyUserImage : 'images/no-profile-image.jpg') + '" alt="pp">\n' +
                                '   </div>\n' +
                                '   <div class="request-row">\n' +
                                '      <strong>' + postData.actionperformedbyUser + ' has assigned ' + postData.sendToName + ' to draft this contract section</strong>\n' +
                                '   </div>\n' +
                                '</div>\n';
                            getOpenContractUserDetails(socket, redirection = false);
                        } else {
                            html += '<div class="message-wrapper reverse ' + (postData.with == "Counterparty" ? "light-gold-color" : "") + '">\n' +
                                '   <div class="profile-picture">\n' +
                                '      <p class="last-seen">' + formatDate(new Date()) + '</p>\n' +
                                '      <p class="name">' + postData.actionperformedbyUser + '</p>\n' +
                                '      <img src="' + (postData.actionperformedbyUserImage ? postData.actionperformedbyUserImage : 'images/no-profile-image.jpg') + '" alt="pp">\n' +
                                '   </div>\n' +
                                '   <div class="message-content">\n' +
                                '      <div class="message">' + (postData.message ? postData.message.trim().replaceAll(/\n/g, '<br>') : '') + '</div>\n' +
                                '   </div>\n' +
                                '</div>\n';
                        }
                        if (postData.messageType == 'Notification' && postData.confirmationType == 'request_draft' && postData.sendTo) {
                            if (postData.with == "Counterparty") {
                                var contentDiv = document.getElementById("chatArea");
                                var newElement = document.createElement("div");
                                newElement.innerHTML = html;
                                contentDiv.appendChild(newElement);

                                var myDiv = document.getElementById("chatBodyID");
                                var scrollToOptions = {
                                    top: myDiv.scrollHeight,
                                    behavior: 'smooth'
                                };
                                myDiv.scrollTo(scrollToOptions);
                            } else {
                                var contentDiv = document.getElementById("chatCPArea");
                                var newElement = document.createElement("div");
                                newElement.innerHTML = html;
                                contentDiv.appendChild(newElement);

                                var myDiv = document.getElementById("chatCPBodyID");
                                var scrollToOptions = {
                                    top: myDiv.scrollHeight,
                                    behavior: 'smooth'
                                };
                                myDiv.scrollTo(scrollToOptions);
                            }
                        } else {
                            if (postData.with == "Counterparty") {
                                var contentDiv = document.getElementById("chatCPArea");
                                var newElement = document.createElement("div");
                                newElement.innerHTML = html;
                                contentDiv.appendChild(newElement);

                                var myDiv = document.getElementById("chatCPBodyID");
                                var scrollToOptions = {
                                    top: myDiv.scrollHeight,
                                    behavior: 'smooth'
                                };
                                myDiv.scrollTo(scrollToOptions);
                            } else {
                                var contentDiv = document.getElementById("chatArea");
                                var newElement = document.createElement("div");
                                newElement.innerHTML = html;
                                contentDiv.appendChild(newElement);

                                var myDiv = document.getElementById("chatBodyID");
                                var scrollToOptions = {
                                    top: myDiv.scrollHeight,
                                    behavior: 'smooth'
                                };
                                myDiv.scrollTo(scrollToOptions);
                            }
                        }
                        document.getElementById('rejectPositionPopup').classList.add(displayNoneClass);
                        document.getElementById('reconfirmPositionPopup').classList.add(displayNoneClass);
                        document.getElementById('assignDraftRequestPopup').classList.add(displayNoneClass);
                        document.getElementById('rejectDarftPopup').classList.add(displayNoneClass);
                        document.getElementById('rejectDarftRequestPopup').classList.add(displayNoneClass);

                        // Refresh the contract section lists
                        clauseNextPage = 1;
                        clauseHasNextPage = true;
                        clauseLists = [];
                        getContractSectionList();
                        document.getElementById('mainLoader').classList.add(displayNoneClass);

                        return true;
                    } else {
                        document.getElementById('mainLoader').classList.add(displayNoneClass);
                    }
                })
                .catch(error => {
                    // Handle any errors
                    console.error('Error:', error);
                    document.getElementById('mainLoader').classList.add(displayNoneClass);
                });
        } catch (error) {
            console.error('Error fetching data:', error);
            document.getElementById('mainLoader').classList.add(displayNoneClass);
        }
    }

    /**
     * @param reopenDetail
     * @param socket
     * @returns {Promise<void>}
     */
    async function reOpenCompletedContractSection(reopenDetail, socket) {
        try {
            document.getElementById('mainLoader').classList.remove(displayNoneClass);
            var reOpenCompletedContractSectionUrl = apiBaseUrl + '/contractSection/reOpenCompletedContractSection/' + reopenDetail.contractSectionId;
            var headers = {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + authToken
            };
            var requestOptions = {
                method: 'GET',
                headers: headers,
            };
            fetch(reOpenCompletedContractSectionUrl, requestOptions)
                .then(response => response.json())
                .then(data => {
                    // Handle the response data
                    var responseData = data;

                    // Send the message to contract section same side
                    socket.emit('contract_section_message', reopenDetail);

                    // Send the message to contract history section
                    var generalChatData = reopenDetail;
                    generalChatData.chatRoomName = 'conversion_history_' + selectedCommentThereadID;
                    socket.emit('conversion_history_message', generalChatData);

                    // Send the message to contract counterparty side
                    var oppositeChat = reopenDetail;
                    oppositeChat.with = 'Counterparty';
                    oppositeChat.messageConfirmationFor = 'Opposite Side';
                    oppositeChat.chatRoomName = 'counter_' + selectedCommentThereadID;
                    socket.emit('contract_section_message', oppositeChat);
                    document.getElementById('mainLoader').classList.add(displayNoneClass);
                })
                .catch(error => {
                    // Handle any errors
                    console.error('Error:', error);
                    document.getElementById('mainLoader').classList.add(displayNoneClass);
                });
        } catch (error) {
            console.error('Error fetching data:', error);
            document.getElementById('mainLoader').classList.add(displayNoneClass);
        }
    }

    /**
     * @param meetingID
     * @returns {Promise<void>}
     */
    async function getContractMeetingDetails(meetingID) {
        try {
            document.getElementById('mainLoader').classList.remove(displayNoneClass);
            var meetingDetailsUrl = apiBaseUrl + '/meeting/getContractMeetingDetails/' + meetingID;
            var headers = {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + authToken
            };
            var requestOptions = {
                method: 'GET',
                headers: headers,
            };
            fetch(meetingDetailsUrl, requestOptions)
                .then(response => response.json())
                .then(data => {
                    // Handle the response data
                    var responseData = data;
                    if (responseData && responseData.status == true && responseData.code == 200) {
                        var response = responseData.data;
                        // console.log('data', response);

                        var participantCount = response.meetingParticipants ? response.meetingParticipants.length : 0

                        document.getElementById('meetingPopup').classList.remove(displayNoneClass);

                        document.getElementById('meetingTitle').textContent = response.meetingTitle;
                        document.getElementById('meetingAgenda').textContent = response.meetingAgenda;
                        document.getElementById('meetingScheduleTime').textContent = formatDateForMeeting(response.meetingDate);
                        document.getElementById('MeetingTimings').textContent = response.meetingStartTime + " - " + response.meetingEndTime;

                        // document.getElementById('meetingOrganiserName').textContent = response.meetingOrganiser.firstName + " " + response.meetingOrganiser.lastName + "(Organiser)";
                        // document.getElementById('meetingOrganiserImage').src = response.meetingOrganiser.imageUrl ?? 'images/no-profile-image.jpg';
                        document.getElementById('participantCounts').textContent = participantCount;


                        var iHtml = '<ul>';
                        iHtml += '<li>\n' +
                            '\t\t\t\t<div class="meeting-user-item">\n' +
                            '\t\t\t\t\t\t\t\t<div class="left-item">\n' +
                            '\t\t\t\t\t\t\t\t\t\t\t\t<img src="' + (response.meetingOrganiser.imageUrl ?? 'images/no-profile-image.jpg') + '" alt="">\n' +
                            '\t\t\t\t\t\t\t\t\t\t\t\t<span>' + response.meetingOrganiser.firstName + " " + response.meetingOrganiser.lastName + '(Organiser)</span>\n' +
                            '\t\t\t\t\t\t\t\t</div>\n' +
                            '\t\t\t\t</div>\n' +
                            '</li>';
                        response.meetingParticipants.forEach((ele) => {
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
                                '\t\t\t\t\t\t\t\t\t\t\t\t<img src="' + (ele.userInfo.imageUrl ?? 'images/no-profile-image.jpg') + '" alt="">\n' +
                                '\t\t\t\t\t\t\t\t\t\t\t\t<span>' + ele.userInfo.firstName + " " + ele.userInfo.lastName + '</span>\n' +
                                '\t\t\t\t\t\t\t\t</div>\n' +
                                '\t\t\t\t\t\t\t\t<div class="meeting-status">\n' +
                                '\t\t\t\t\t\t\t\t\t\t\t\t<img src="' + meetingStatus + '" alt="">\n' +
                                '\t\t\t\t\t\t\t\t</div>\n' +
                                '\t\t\t\t</div>\n' +
                                '</li>';
                        });
                        iHtml += '</ul>';
                        document.getElementById('meetingParticipantList').innerHTML = iHtml;
                        document.getElementById('mainLoader').classList.add(displayNoneClass);
                    } else {
                        document.getElementById('mainLoader').classList.add(displayNoneClass);
                    }
                })
                .catch(error => {
                    // Handle any errors
                    console.error('Error:', error);
                    document.getElementById('mainLoader').classList.add(displayNoneClass);
                });
        } catch (error) {
            console.error('Error fetching data:', error);
            document.getElementById('mainLoader').classList.add(displayNoneClass);
        }
    }

    /**
     * @returns {Promise<void>}
     */
    async function redirectToMessageScreen() {
        try {
            if (selectedThreadID) {
                // console.log('selectedContractSectionDetails', selectedContractSectionDetails);
                if (selectedContractSectionDetails && selectedContractSectionDetails.contractStatus && selectedContractSectionDetails.contractStatus == "Completed") {
                    chatHistoryNextPage = 1;
                    chatHistoryHasNextPage = true;
                    getContractSectionMessageHistory();
                    document.getElementById('divContractLists').classList.add(displayNoneClass);
                    document.getElementById('divContractChatHistory').classList.remove(displayNoneClass);
                } else {
                    document.getElementById('mainLoader').classList.remove(displayNoneClass);
                    var checkActionRequiredURL = apiBaseUrl + '/contractSection/getRequiredActionWindow/' + selectedThreadID + '?sort[createdAt]=-1&page=1&limit=500';
                    var headers = {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + authToken
                    };
                    var requestOptions = {
                        method: 'GET',
                        headers: headers,
                    };
                    fetch(checkActionRequiredURL, requestOptions)
                        .then(response => response.json())
                        .then(data => {
                            // Handle the response data
                            var responseData = data;
                            if (responseData && responseData.status == true && responseData.code == 200) {
                                var response = responseData.data;
                                // console.log('data', response.data);
                                if (response.total > 0) {
                                    document.getElementById('mainLoader').classList.add(displayNoneClass);
                                    var draftEditRequest = response.data.filter(item => item.messageConfirmationFor == "Same Side" && item.messageType == "Draft Edit Request");
                                    var samesideMessage = response.data.filter(item => item.messageConfirmationFor == "Same Side" && item.messageType !== "Draft Edit Request");
                                    var counterpartyMessage = response.data.filter(item => item.messageConfirmationFor != "Same Side");
                                    if (draftEditRequest && draftEditRequest.length > 0) {
                                        withType = 'Counterparty';
                                        messageConfirmationFor = 'Opposite Side';
                                        document.getElementById('chatCPArea').innerHTML = '';
                                        chatNextPage = 1;
                                        chatHasNextPage = true;
                                        getContractSectionMessageList('Counterparty');
                                        var chatRoomName = getChatRoom(withType);
                                        socket.emit('join_contract_section_chat_room', chatRoomName);
                                        document.getElementById("messageInputCP").value = "";
                                        document.getElementById('divContractLists').classList.add(displayNoneClass);
                                        document.getElementById('divContractCounterpartyChat').classList.remove(displayNoneClass);
                                        document.getElementById('divContractSameSideChat').classList.add(displayNoneClass);
                                        document.getElementById('divContractChatHistory').classList.add(displayNoneClass);
                                    } else if (samesideMessage && samesideMessage.length > 0) {
                                        withType = 'Our Team';
                                        messageConfirmationFor = 'Same Side';
                                        document.getElementById('chatArea').innerHTML = '';
                                        chatNextPage = 1;
                                        chatHasNextPage = true;
                                        getContractSectionMessageList('our');
                                        var chatRoomName = getChatRoom(withType);
                                        socket.emit('join_contract_section_chat_room', chatRoomName);
                                        document.getElementById("messageInput").value = "";
                                        document.getElementById('divContractLists').classList.add(displayNoneClass);
                                        document.getElementById('divContractSameSideChat').classList.remove(displayNoneClass);
                                        document.getElementById('divContractCounterpartyChat').classList.add(displayNoneClass);
                                        document.getElementById('divContractChatHistory').classList.add(displayNoneClass);
                                    } else if (counterpartyMessage && counterpartyMessage.length > 0) {
                                        withType = 'Counterparty';
                                        messageConfirmationFor = 'Opposite Side';
                                        document.getElementById('chatCPArea').innerHTML = '';
                                        chatNextPage = 1;
                                        chatHasNextPage = true;
                                        getContractSectionMessageList('Counterparty');
                                        var chatRoomName = getChatRoom(withType);
                                        socket.emit('join_contract_section_chat_room', chatRoomName);
                                        document.getElementById("messageInputCP").value = "";
                                        document.getElementById('divContractLists').classList.add(displayNoneClass);
                                        document.getElementById('divContractCounterpartyChat').classList.remove(displayNoneClass);
                                        document.getElementById('divContractSameSideChat').classList.add(displayNoneClass);
                                        document.getElementById('divContractChatHistory').classList.add(displayNoneClass);
                                    } else {
                                        chatHistoryNextPage = 1;
                                        chatHistoryHasNextPage = true;
                                        getContractSectionMessageHistory();
                                        document.getElementById('divContractLists').classList.add(displayNoneClass);
                                        document.getElementById('divContractChatHistory').classList.remove(displayNoneClass);
                                    }
                                } else {
                                    document.getElementById('mainLoader').classList.add(displayNoneClass);
                                    if (chatWindows == 'SS' || clauseChatWindows == 'SS') {
                                        withType = 'Our Team';
                                        messageConfirmationFor = 'Same Side';
                                        document.getElementById('chatArea').innerHTML = '';
                                        chatNextPage = 1;
                                        chatHasNextPage = true;
                                        getContractSectionMessageList('our');
                                        var chatRoomName = getChatRoom(withType);
                                        socket.emit('join_contract_section_chat_room', chatRoomName);
                                        document.getElementById("messageInput").value = "";
                                        document.getElementById('divContractLists').classList.add(displayNoneClass);
                                        document.getElementById('divContractChatHistory').classList.add(displayNoneClass);
                                        document.getElementById('divContractSameSideChat').classList.remove(displayNoneClass);
                                        document.getElementById('divContractCounterpartyChat').classList.add(displayNoneClass);
                                    } else if (chatWindows == 'CP' || clauseChatWindows == 'CP') {
                                        withType = 'Counterparty';
                                        messageConfirmationFor = 'Opposite Side';
                                        document.getElementById('chatCPArea').innerHTML = '';
                                        chatNextPage = 1;
                                        chatHasNextPage = true;
                                        getContractSectionMessageList('Counterparty');
                                        var chatRoomName = getChatRoom(withType);
                                        socket.emit('join_contract_section_chat_room', chatRoomName);
                                        document.getElementById("messageInputCP").value = "";
                                        document.getElementById('divContractLists').classList.add(displayNoneClass);
                                        document.getElementById('divContractChatHistory').classList.add(displayNoneClass);
                                        document.getElementById('divContractSameSideChat').classList.add(displayNoneClass);
                                        document.getElementById('divContractCounterpartyChat').classList.remove(displayNoneClass);
                                    } else {
                                        chatHistoryNextPage = 1;
                                        chatHistoryHasNextPage = true;
                                        getContractSectionMessageHistory();
                                        document.getElementById('divContractLists').classList.add(displayNoneClass);
                                        document.getElementById('divContractSameSideChat').classList.add(displayNoneClass);
                                        document.getElementById('divContractCounterpartyChat').classList.add(displayNoneClass);
                                        document.getElementById('divContractChatHistory').classList.remove(displayNoneClass);
                                    }
                                }
                            } else {
                                document.getElementById('mainLoader').classList.add(displayNoneClass);
                                chatHistoryNextPage = 1;
                                chatHistoryHasNextPage = true;
                                getContractSectionMessageHistory();
                                document.getElementById('divContractLists').classList.add(displayNoneClass);
                                document.getElementById('divContractChatHistory').classList.remove(displayNoneClass);
                            }
                        })
                        .catch(error => {
                            // Handle any errors
                            console.error('Error:', error);
                            document.getElementById('mainLoader').classList.add(displayNoneClass);
                        });
                }
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            document.getElementById('mainLoader').classList.add(displayNoneClass);
        }
    }

    /**
     * @returns {Promise<void>}
     */
    async function unreadMessageForThread() {
        try {
            document.getElementById('mainLoader').classList.remove(displayNoneClass);
            var data = JSON.stringify({
                contractSectionId: selectedThreadID
            });
            var unreadMessageThreadUrl = apiBaseUrl + '/contractSection/updateUnreadMessageStatus/';
            var headers = {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + authToken
            };
            var requestOptions = {
                method: 'POST',
                headers: headers,
                body: data
            };
            fetch(unreadMessageThreadUrl, requestOptions)
                .then(response => response.json())
                .then(data => {
                    // Handle the response data
                    document.getElementById('mainLoader').classList.add(displayNoneClass);
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
                    console.error('Error:', error);
                    document.getElementById('mainLoader').classList.add(displayNoneClass);
                });
        } catch (error) {
            console.error('Error fetching data:', error);
            document.getElementById('mainLoader').classList.add(displayNoneClass);
        }
    }

    /**
     * @returns {Promise<void>}
     */
    function checkNewMessageAppear() {
        try {
            if (!document.getElementById('divContractLists').classList.contains(displayNoneClass) && document.querySelectorAll('.contract-item').length > 0) {
                var limit = clauseRecordLimit * clauseRecordLimit;
                var getContractSectionListUrl = apiBaseUrl + '/contractSection/getSelectedStatusContractSection/all/' + documentID;
                //?filter[description]=Test&sort[createdAt]=-1&page=1&limit=6
                getContractSectionListUrl += '?';
                var queryParam = [];
                // Search text
                if (searchText) {
                    queryParam.push('filter[search_text]=' + searchText);
                }
                // Set sortby created time
                queryParam.push('sort[createdAt]=-1');
                // Set pageSize
                queryParam.push('page= 1');
                // Set recordLimit
                queryParam.push('limit=' + limit);
                // Set queryparams
                getContractSectionListUrl += queryParam.join('&');
                var headers = {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + authToken
                };
                var requestOptions = {
                    method: 'GET',
                    headers: headers,
                };
                fetch(getContractSectionListUrl, requestOptions)
                    .then(response => response.json())
                    .then(data => {
                        // Handle the response data
                        var responseData = data;
                        if (responseData && responseData.data) {
                            var resData = responseData.data;
                            // console.log('resData', resData.data);
                            var divElements = document.querySelectorAll('.contract-item');

                            divElements.forEach(function (element) {
                                // console.log('getAttribute', element.dataset.id);
                                var clauseItemTemp = resData.data.filter((ele) => ele._id === element.dataset.id);
                                if (clauseItemTemp && clauseItemTemp.length > 0 && clauseItemTemp[0].hasUnreadMessage) {
                                    element.querySelector('.notification-no').classList.remove(displayNoneClass);
                                    element.setAttribute('data-chatwindow', clauseItemTemp[0].unreadMessageSide ? clauseItemTemp[0].unreadMessageSide : '-')
                                } else {
                                    element.querySelector('.notification-no').classList.add(displayNoneClass);
                                }
                            });
                        }
                    })
                    .catch(error => {
                        // Handle any errors
                        console.error('Error:', error);

                    });
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
    /**================================ API Function End ==================================*/
})(window, undefined);
