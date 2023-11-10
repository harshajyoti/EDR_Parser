##### EDR Encode/Decode Functionality ##### 
#### Authors: ameena@cisco.com, hjyoti@cisco.com ####

import pandas as pd
import numpy as np
import os
from pathlib import Path
from tkinter import filedialog
from flask import Flask, render_template
import zipfile
import pkg_resources
import socket
import json
from datetime import datetime, timedelta
import warnings
import sys

# -------------------------------------- Below are the Event-ID data(Attributes) ------------------------------------- #

version1 = {0:"(Version)",1:"(Field-Count)",2:"(Transaction-ID)",3:"(Start-Time)",4:"(Elapsed-Time)",
            5:"(Subscriber-ID)",6:"(Transaction-Type)",7:"(Event-Name)",8:"(Session-Primary-Key)",
            9:"(Session-Unique-Key)",10:"(Session-Non-Unique-key)",11:"(Status)",12:"(Status-Code)",
            13:"(Procedure-Name)",14:"(Event Name)",15:"(State)",16:"(Execution-Stages)"}

event_id1287 = {0:"(PROCEDURE-ID)",1:"(EVENT-ID): (N11SmContextCreateReq)",2:"(VERSION)",3:"(FIELD-COUNT)",4:"(SUPI)",5:"(IMEI/PEI)",
                6:"(IMSI)",7:"(MSISDN)",8:"(GPSI)",9:"(STATUS)",10:"(STATUS-CODE)",11:"(N1-REQ-PDU(PDN)-SESSION-TYPE)",
                12:"(N1-REQ-SSC-MODE)",13:"(CAUSE)",14:"(N1-PCO)",15:"(N1-REQ-MSG-TYPE)",16:"(N2-REQ-MSG-TYPE)",
                17:"(N1-RSP-MSG-TYPE)",18:"(N2-RSP-MSG-TYPE)",19:"(N1-REQ-MAX-SUPP-FILTERS)",20:"(N1-ALWAYS-ON)",
                21:"(--NO DATA--)",22:"(RAT-TYPE)",23:"(S-NSSAI-REQUESTED)",24:"(GUAMI)",25:"(REQUEST-TYPE)",
                26:"(AN-TYPE)",27:"(OLD-PDU-SESS-ID)",28:"(N1-DNN/APN)",29:"(SERVING-NFID)",30:"(SERVING-PLMN)",
                31:"(UNAUTH-SUPI)",32:"(S-NSSAI-ASSIGNED)",33:"(N1-PDU-SESS-ID)",
                34:"(INDIRECTFWDFLAG)",35:"(DIRECTFWDFLAG)",36:"(HO-STATE)"}

event_id1290 = {0:"(PROCEDURE-ID)",1:"(EVENT-ID): (N11SmContextUpdateReq)",2:"(VERSION)",3:"(FIELD-COUNT)",4:"(STATUS)",5:"(STATUS-CODE)",
                6:"(SUPI)",7:"(IMEI)",8:"(IMSI)",9:"(MSISDN)",10:"(PDU(PDN)-SESSION-TYPE)",11:"(N1-REQ-MSG-TYPE)",
                12:"(N2-REQ-MSG-TYPE)",13:"(N1-RSP-MSG-TYPE)",14:"(N2-RSP-MSG-TYPE)",15:"(N1-PCO)",
                16:"(N1-QOS-RULE)",17:"(N1-QOS-DESC)",18:"(CAUSE)",19:"(N1-ALWAYS-ON)",20:"(5G-SM-CAP)",
                21:"(N1-RSP-MAX-SUPP-FILTERS)",22:"(RAT-TYPE)",23:"(UP-CONTEXT-STATE)",24:"(HO-STATE)",
                25:"(N1-BACKOFF-TIME)",26:"(N1-PDU-SESS-ID)",27:"(N1-VGSM-RE-ATTEMPT-IND)",28:"(N1-RE-ATTEMPT-IND)",
                29:"(N1-SESS-AMBR)",30:"(N1-CONG-RE-ATTEMPT-IND)",31:"(N1-RSP-ALWAYS-ON)",32:"(DATAFORWARDING)"}

event_id1299 = {0:"(PROCEDURE-ID)",1:"(EVENT-ID): (N11N1N2MessageTransferReq)",2:"(VERSION)",3:"(FIELD-COUNT)",4:"(STATUS)",5:"(STATUS-CODE)",
                6:"(PDU-SESSION-TYPE)",7:"(N1-REQ-MSG-TYPE)",8:"(N2-REQ-MSG-TYPE)",9:"(N1-RSP-MSG-TYPE)",
                10:"(N2-RSP-MSG-TYPE)",11:"(N1-PCO)",12:"(N1-QOS-RULE)",13:"(N1-QOS-DESC)",14:"(CAUSE)",
                15:"(N1-ALWAYS-ON)",16:"(N1-SESSION-AMBR)",17:"(N1-PAA)",18:"(N1-S-NSSAI)",19:"(N1-PDU-SESS-ID)",
                20:"(N1-DNN/APN)",21:"(N1-BACKOFF-TIME)",22:"(N1-REQ-SSC-MODE-SELECTED)",23:"(N1-REQ-PDU(PDN)-SESSION-TYPE-SELECTED)",
                24:"(N1-SSC-MODE-ALLOWED)",25:"(N1-CONG-RE-ATTEMPT-IND)",26:"(N1-RE-ATTEMPT-IND)",27:"(N1-RSP-AN-TYPE)"}

event_id1302 = {0:"(PROCEDURE-ID)",1:"(EVENT-ID): (N11EbiAssignmentReq)",2:"(VERSION)",3:"(FIELD-COUNT)",
                4:"(STATUS)",5:"(STATUS-CODE)",6:"(PDU(PDN)-SESSION-TYPE)",7:"(CAUSE)"}

event_id1304 = {0:"(PROCEDURE-ID)",1:"(EVENT-ID): (N11SmContextReleaseReq)",2:"(VERSION)",3:"(FIELD-COUNT)",
                4:"(STATUS)",5:"(STATUS-CODE)",6:"(PDU(PDN)-SESSION-TYPE)",7:"(CAUSE)"}

event_id1310 = {0:"(PROCEDURE-ID)",1:"(EVENT-ID): (N11SmContextStatusNotifyReq)",2:"(VERSION)",3:"(FIELD-COUNT)",
                4:"(STATUS)",5:"(STATUS-CODE)",6:"(PDU(PDN)-SESSION-TYPE)",7:"(CAUSE)"}

event_id1339 = {0:"(PROCEDURE-ID)",1:"(EVENT-ID): (N11N1N2MessageTransferFailNotificationReq)",2:"(VERSION)",3:"(FIELD-COUNT)",
                4:"(STATUS)",5:"(STATUS-CODE)",6:"(PDU(PDN)-SESSION-TYPE)",7:"(CAUSE)"}

event_id527 = {0:"(PROCEDURE-ID)",1:"(EVENT-ID): (N4SessionModificationReq)",2:"(VERSION)",3:"(FIELD-COUNT)",
                4:"(STATUS)",5:"(STATUS-CODE)",6:"(PDU(PDN)-SESSION-TYPE)",7:"(CAUSE)"}

event_id530 = {0:"(PROCEDURE-ID)",1:"(EVENT-ID): (N4SessionReleaseReq)",2:"(VERSION)",3:"(FIELD-COUNT)",
                4:"(STATUS)",5:"(STATUS-CODE)",6:"(PDU(PDN)-SESSION-TYPE)",7:"(CAUSE)"}

event_id524 = {0:"(PROCEDURE-ID)",1:"(EVENT-ID): (N4SessionEstablishmentReq)",2:"(VERSION)",3:"(FIELD-COUNT)",
                4:"(STATUS)",5:"(STATUS-CODE)",6:"(PDU(PDN)-SESSION-TYPE)",7:"(CAUSE)"}

event_id3335 = {0:"(PROCEDURE-ID)",1:"(EVENT-ID): (N7SmPolicyDeleteReq)",2:"(VERSION)",3:"(FIELD-COUNT)",
                4:"(STATUS)",5:"(STATUS-CODE)",6:"(PDU(PDN)-SESSION-TYPE)",7:"(CAUSE)"}

event_id3332 = {0:"(PROCEDURE-ID)",1:"(EVENT-ID): (N7SmPolicyUpdateReq)",2:"(VERSION)",3:"(FIELD-COUNT)",
                4:"(STATUS)",5:"(STATUS-CODE)",6:"(PDU(PDN)-SESSION-TYPE)",7:"(CAUSE)"}

event_id3341 = {0:"(PROCEDURE-ID)",1:"(EVENT-ID): (N7SmPolicyTerminateNotifyReq)",2:"(VERSION)",3:"(FIELD-COUNT)",
                4:"(STATUS)",5:"(STATUS-CODE)",6:"(PDU(PDN)-SESSION-TYPE)",7:"(CAUSE)"}

event_id3338 = {0:"(PROCEDURE-ID)",1:"(EVENT-ID): (N7SmPolicyUpdateNotifyReq)",2:"(VERSION)",3:"(FIELD-COUNT)",
                4:"(STATUS)",5:"(STATUS-CODE)",6:"(PDU(PDN)-SESSION-TYPE)",7:"(CAUSE)"}

event_id1432 = {0:"(PROCEDURE-ID)",1:"(EVENT-ID): (N10UnsubscribeForNotificationReq)",2:"(VERSION)",3:"(FIELD-COUNT)",
                4:"(STATUS)",5:"(STATUS-CODE)",6:"(PDU(PDN)-SESSION-TYPE)",7:"(CAUSE)"}

event_id1319 = {0:"(PROCEDURE-ID)",1:"(EVENT-ID): (N10SubscribeForNotificationReq)",2:"(VERSION)",3:"(FIELD-COUNT)",
                4:"(STATUS)",5:"(STATUS-CODE)",6:"(PDU(PDN)-SESSION-TYPE)",7:"(CAUSE)"}

event_id1313 = {0:"(PROCEDURE-ID)",1:"(EVENT-ID): (N10RegistrationRequest)",2:"(VERSION)",3:"(FIELD-COUNT)",
                4:"(STATUS)",5:"(STATUS-CODE)",6:"(PDU(PDN)-SESSION-TYPE)",7:"(CAUSE)"}

event_id1316 = {0:"(PROCEDURE-ID)",1:"(EVENT-ID): (N10SubscriptionFetchReq)",2:"(VERSION)",3:"(FIELD-COUNT)",
                4:"(STATUS)",5:"(STATUS-CODE)",6:"(PDU(PDN)-SESSION-TYPE)",7:"(CAUSE)"}

event_id1325 = {0:"(PROCEDURE-ID)",1:"(EVENT-ID): (N10DeregistrationRequest)",2:"(VERSION)",3:"(FIELD-COUNT)",
                4:"(STATUS)",5:"(STATUS-CODE)",6:"(PDU(PDN)-SESSION-TYPE)",7:"(CAUSE)"}

event_id1322 = {0:"(PROCEDURE-ID)",1:"(EVENT-ID): (N10UpdateNotifyReq)",2:"(VERSION)",3:"(FIELD-COUNT)",
                4:"(STATUS)",5:"(STATUS-CODE)",6:"(PDU(PDN)-SESSION-TYPE)",7:"(CAUSE)"}

event_id1003 = {0:"(PROCEDURE-ID)",1:"(EVENT-ID): (N40ChargingDataCreateReq)",2:"(VERSION)",3:"(FIELD-COUNT)",
                4:"(STATUS)",5:"(STATUS-CODE)",6:"(PDU(PDN)-SESSION-TYPE)",7:"(CAUSE)"}

event_id1004 = {0:"(PROCEDURE-ID)",1:"(EVENT-ID): (N40ChargingDataUpdateReq)",2:"(VERSION)",3:"(FIELD-COUNT)",
                4:"(STATUS)",5:"(STATUS-CODE)",6:"(PDU(PDN)-SESSION-TYPE)",7:"(CAUSE)"}

event_id1005 = {0:"(PROCEDURE-ID)",1:"(EVENT-ID): (N40ChargingDataReleaseReq)",2:"(VERSION)",3:"(FIELD-COUNT)",
                4:"(STATUS)",5:"(STATUS-CODE)",6:"(PDU(PDN)-SESSION-TYPE)",7:"(CAUSE)"}

event_id3588 = {0:"(PROCEDURE-ID)",1:"(EVENT-ID): (N40ChargingNotificationReq)",2:"(VERSION)",3:"(FIELD-COUNT)",
                4:"(STATUS)",5:"(STATUS-CODE)",6:"(PDU(PDN)-SESSION-TYPE)",7:"(CAUSE)"}

event_id2307 = {0:"(PROCEDURE-ID)",1:"(EVENT-ID): (SecondaryAuthenReq)",2:"(VERSION)",3:"(FIELD-COUNT)",
                4:"(STATUS)",5:"(STATUS-CODE)",6:"(PDU(PDN)-SESSION-TYPE)",7:"(CAUSE)"}

event_id2055 = {0:"(PROCEDURE-ID)",1:"(EVENT-ID): (S5S8DeleteSessReq)",2:"(VERSION)",3:"(FIELD-COUNT)",
                4:"(STATUS)",5:"(STATUS-CODE)",6:"(PDU(PDN)-SESSION-TYPE)",7:"(CAUSE)"}

event_id2313 = {0:"(PROCEDURE-ID)",1:"(EVENT-ID): (RadiusCoaDisconnectReq)",2:"(VERSION)",3:"(FIELD-COUNT)",
                4:"(STATUS)",5:"(STATUS-CODE)",6:"(PDU(PDN)-SESSION-TYPE)",7:"(CAUSE)"}

event_id2309 = {0:"(PROCEDURE-ID)",1:"(EVENT-ID): (RadiusAcctReq)",2:"(VERSION)",3:"(FIELD-COUNT)",
                4:"(STATUS)",5:"(STATUS-CODE)",6:"(PDU(PDN)-SESSION-TYPE)",7:"(CAUSE)"}

event_id1307 = {0:"(PROCEDURE-ID)",1:"(EVENT-ID): (N11SmContextRetrieveReq)",2:"(VERSION)",3:"(FIELD-COUNT)",
                4:"(STATUS)",5:"(STATUS-CODE)",6:"(PDU(PDN)-SESSION-TYPE)",7:"(CAUSE)"}

event_id542 = {0:"(PROCEDURE-ID)",1:"(EVENT-ID): (N4GtpuRouterAdvertisementReq)",2:"(VERSION)",3:"(FIELD-COUNT)",
                4:"(STATUS)",5:"(STATUS-CODE)",6:"(PDU(PDN)-SESSION-TYPE)",7:"(CAUSE)"}

event_id3329 = {0:"(PROCEDURE-ID)",1:"(EVENT-ID): (N7SmPolicyCreateReq)",2:"(VERSION)",3:"(FIELD-COUNT)",4:"(SUPI)",5:"(IMEI/PEI)",
                6:"(GPSI)",7:"(STATUS)",8:"(STATUS-CODE)",9:"(PDU(PDN)-SESSION-TYPE)",10:"(QOS-DESC)",
                11:"(SESSION-AMBR)",12:"(CAUSE)"}

event_id2066 = {0:"(PROCEDURE-ID)",1:"(EVENT-ID): (S5S8DeleteBearerCmd)",2:"(VERSION)",3:"(FIELD-COUNT)",4:"(STATUS)",5:"(STATUS-CODE)",
                6:"(BEARER-CTX-REQUESTED)",7:"(CAUSE)",8:"(BEARER-CTX-RESPONDED)",9:"(RECOVERY)"}

event_id2051 = {0:"(PROCEDURE-ID)",1:"(EVENT-ID): (S5S8CreateSessReq)",2:"(VERSION)",3:"(FIELD-COUNT)",4:"(SUPI)",5:"(IMEI/PEI)",
                6:"(IMSI)",7:"(MSISDN)",8:"(GPSI)",9:"(STATUS)",10:"(STATUS-CODE)",11:"(PCO)",
                12:"(PDU-SESSION-TYPE)",13:"(SSC-MODE)",14:"(DNN/APN)",15:"(QOS-RULE)",16:"(QOS-DESC)",
                17:"(SESSION-AMBR)",18:"(CAUSE)",19:"(PAA)",20:"(S-NSSAI)",
                21:"(RAT-TYPE)"}

event_id2057 = {0:"(PROCEDURE-ID)",1:"(EVENT-ID): (S5S8DeleteBearerReq)",2:"(VERSION)",3:"(FIELD-COUNT)",4:"(STATUS)",5:"(STATUS-CODE)",
                6:"(LBI-REQUESTED)",7:"(EBIS)",8:"(FAILED-BEARER-CTX)",9:"(CAUSE-REQUESTED)",10:"(PCO)",11:"(CAUSE-RESPONDED)",
                12:"(LBI-RESPONDED)",13:"(UE-LOCAL-IP)",14:"(UE-UDP-PORT)",15:"(BEARER-CTX)"}

event_id1444 = {0:"(PROCEDURE-ID)",1:"(EVENT-ID): (N16PduSessionCreateReq)",2:"(VERSION)",3:"(FIELD-COUNT)",4:"(SUPI)",5:"(IMEI/PEI)",
                6:"(GPSI)",7:"(GPSI)",8:"(REQUEST-TYPE)",9:"(STATUS)",10:"(STATUS-CODE)",11:"(PDU/PDN-SESSION-TYPE)",
                12:"(DNN/APN)",13:"(RAT-TYPE)",14:"(S-NSSAI)",15:"(SERVING-PLMN)",16:"(VSMF-ID)",
                17:"(VCNTUNNEL-INFO)",18:"(HO-PREP-INDICATION)",19:"(PGW-S8-CFTEID)",20:"(ALWAYS-ON-REQUESTED)",
                21:"(UE-LOCATION)",22:"(ROAMING-CHRG-PROF-REQUESTED)",23:"(ALWAYS-ON-GRANTED)",24:"(SSC-MODE)",
                25:"(HCNTUNNEL-INFO)",26:"(SESSION-AMBR)",27:"(UE-IPV4-ADDRESS)",28:"(UE-IPV6-PREFIX)",29:"(QOS-FLOWS-SETUP-LIST)",
                30:"(ROAMING-CHRG-PROF-SELECTED)",31:"(CAUSE)",32:"(N1SM-CAUSE)",33:"(UE-IPV6-INTERFACE-ID)",
                34:"(N1-REQ-MSG-TYPE)",35:"(N2-REQ-MSG-TYPE)",36:"(N1-RSP-MSG-TYPE)",37:"(N2-RSP-MSG-TYPE)",
                38:"(N1-PDU-SESS-ID)",39:"(N1-REQ-PDU(PDN)-SESSION-TYPE)",40:"(N1-REQ-SSC-MODE)",41:"(N1-PCO)",
                42:"(N1-REQ-MAX-SUPP-FILTERS)",43:"(N1-ALWAYS-ON)",44:"(N1-REQ-PDU(PDN)-SESSION-TYPE-SELECTED)",
                45:"(N1-REQ-SSC-MODE-SELECTED)",46:"(N1-QOS-RULES)",47:"(N1-QOS-DESC)",48:"(N1-SESS-AMBR)",
                49:"(N1-REQ-ALWAYS-ON)",50:"(N1-REQ-SSC-MODE-ALLOWED)",51:"(N1-CONG-RE-ATTEMPT-IND)",
                52:"(N1-RSP-RE-ATTEMPT-IND)",53:"(N1-DNN/APN)"}

event_id1468 = {0:"(PROCEDURE-ID)",1:"(EVENT-ID): (N16VsmfPduSessionCreateReq)",2:"(VERSION)",3:"(FIELD-COUNT)",4:"(SUPI)",5:"(IMEI/PEI)",
                6:"(GPSI)",7:"(GPSI)",8:"(REQUEST-TYPE)",9:"(STATUS)",10:"(STATUS-CODE)",11:"(PDU/PDN-SESSION-TYPE)",
                12:"(DNN/APN)",13:"(RAT-TYPE)",14:"(S-NSSAI)",15:"(SERVING-PLMN)",16:"(VSMF-ID)",
                17:"(VCNTUNNEL-INFO)",18:"(HO-PREP-INDICATION)",19:"(PGW-S8-CFTEID)",20:"(ALWAYS-ON-REQUESTED)",
                21:"(UE-LOCATION)",22:"(ROAMING-CHRG-PROF-REQUESTED)",23:"(ALWAYS-ON-GRANTED)",24:"(SSC-MODE)",
                25:"(HCNTUNNEL-INFO)",26:"(SESSION-AMBR)",27:"(UE-IPV4-ADDRESS)",28:"(UE-IPV6-PREFIX)",29:"(QOS-FLOWS-SETUP-LIST)",
                30:"(ROAMING-CHRG-PROF-SELECTED)",31:"(CAUSE)",32:"(N1SM-CAUSE)",33:"(UE-IPV6-INTERFACE-ID)",
                34:"(N1-REQ-MSG-TYPE)",35:"(N2-REQ-MSG-TYPE)",36:"(N1-RSP-MSG-TYPE)",37:"(N2-RSP-MSG-TYPE)",
                38:"(N1-PDU-SESS-ID)",39:"(N1-REQ-PDU(PDN)-SESSION-TYPE)",40:"(N1-REQ-SSC-MODE)",41:"(N1-PCO)",
                42:"(N1-REQ-MAX-SUPP-FILTERS)",43:"(N1-ALWAYS-ON)",44:"(N1-REQ-PDU(PDN)-SESSION-TYPE-SELECTED)",
                45:"(N1-REQ-SSC-MODE-SELECTED)",46:"(N1-QOS-RULES)",47:"(N1-QOS-DESC)",48:"(N1-SESS-AMBR)",
                49:"(N1-REQ-ALWAYS-ON)",50:"(N1-REQ-SSC-MODE-ALLOWED)",51:"(N1-CONG-RE-ATTEMPT-IND)",
                52:"(N1-RSP-RE-ATTEMPT-IND)",53:"(N1-DNN/APN)"}

event_id1471 = {0:"(PROCEDURE-ID)",1:"(EVENT-ID): (N16VsmfPduSessionReleaseReq)",2:"(VERSION)",3:"(FIELD-COUNT)",4:"(STATUS)",5:"(STATUS-CODE)",
                6:"(CAUSE)",7:"(VGMM-CAUSE)",8:"(NGAP-CAUSE)"}

event_id1447_3_7 = {0:"(PROCEDURE-ID)",1:"(EVENT-ID): (N16PduSessionHsmfUpdateReq)",2:"(VERSION)",3:"(FIELD-COUNT)",4:"(STATUS)",5:"(STATUS-CODE)",
                6:"(IMEI/PEI)",7:"(REQUEST-INDICATION)",8:"(VCNTUNNEL-INFO)",9:"(SERVING-PLMN)",10:"(AN-TYPE)",
                11:"(RAT-TYPE)",12:"(HO-PREP-INDICATION)",13:"(CAUSE)",14:"(VGMM-CAUSE)",15:"(NGAP-CAUSE)",
                16:"(ALWAYS-ON)",17:"(EPS-IWK)",18:"(AN-TYPE-CAN-BE-CHANGED)",19:"(UE-LOCATION)",20:"(N1-REQ-MSG-TYPE)",
                21:"(N1-RSP-MSG-TYPE)",22:"(N1-PDU-SESS-ID)",23:"(N1-PCO)",24:"(N1-RSP-MAX-SUPP-FILTERS)",
                25:"(N1-REQ-ALWAYS-ON)",26:"(N1-QOS-RULES)",27:"(N1-QOS-DESC)"}

event_id1477_3_7 = {0:"(PROCEDURE-ID)",1:"(EVENT-ID): (N16PduSessionHsmfUpdateReqClient)",2:"(VERSION)",3:"(FIELD-COUNT)",4:"(STATUS)",5:"(STATUS-CODE)",
                6:"(IMEI/PEI)",7:"(REQUEST-INDICATION)",8:"(VCNTUNNEL-INFO)",9:"(SERVING-PLMN)",10:"(AN-TYPE)",
                11:"(RAT-TYPE)",12:"(HO-PREP-INDICATION)",13:"(CAUSE)",14:"(VGMM-CAUSE)",15:"(NGAP-CAUSE)",
                16:"(ALWAYS-ON)",17:"(EPS-IWK)",18:"(AN-TYPE-CAN-BE-CHANGED)",19:"(UE-LOCATION)",20:"(N1-REQ-MSG-TYPE)",
                21:"(N1-RSP-MSG-TYPE)",22:"(N1-PDU-SESS-ID)",23:"(N1-PCO)",24:"(N1-RSP-MAX-SUPP-FILTERS)",
                25:"(N1-REQ-ALWAYS-ON)",26:"(N1-QOS-RULES)",27:"(N1-QOS-DESC)"}

event_id1447_4_5 = {0:"(PROCEDURE-ID)",1:"(EVENT-ID): (N16PduSessionHsmfUpdateReq)",2:"(VERSION)",3:"(FIELD-COUNT)",4:"(STATUS)",5:"(STATUS-CODE)",
                6:"(IMEI/PEI)",7:"(REQUEST-INDICATION)",8:"(VCNTUNNEL-INFO)",9:"(SERVING-PLMN)",10:"(AN-TYPE)",
                11:"(RAT-TYPE)",12:"(HO-PREP-INDICATION)",13:"(CAUSE)",14:"(VGMM-CAUSE)",15:"(NGAP-CAUSE)",
                16:"(ALWAYS-ON)",17:"(EPS-IWK)",18:"(AN-TYPE-CAN-BE-CHANGED)",19:"(N1-PDU-SESS-ID)",20:"(N1-PCO)",
                21:"(N1-RSP-MAX-SUPP-FILTERS)",22:"(N1-ALWAYS-ON)",23:"(N1-QOS-RULES)",24:"(N1-QOS-DESC)"}

event_id1477_4_5 = {0:"(PROCEDURE-ID)",1:"(EVENT-ID): (N16PduSessionHsmfUpdateReqClient)",2:"(VERSION)",3:"(FIELD-COUNT)",4:"(STATUS)",5:"(STATUS-CODE)",
                6:"(IMEI/PEI)",7:"(REQUEST-INDICATION)",8:"(VCNTUNNEL-INFO)",9:"(SERVING-PLMN)",10:"(AN-TYPE)",
                11:"(RAT-TYPE)",12:"(HO-PREP-INDICATION)",13:"(CAUSE)",14:"(VGMM-CAUSE)",15:"(NGAP-CAUSE)",
                16:"(ALWAYS-ON)",17:"(EPS-IWK)",18:"(AN-TYPE-CAN-BE-CHANGED)",19:"(N1-PDU-SESS-ID)",20:"(N1-PCO)",
                21:"(N1-RSP-MAX-SUPP-FILTERS)",22:"(N1-ALWAYS-ON)",23:"(N1-QOS-RULES)",24:"(N1-QOS-DESC)"}

event_id1451 = {0:"(PROCEDURE-ID)",1:"(EVENT-ID): (N16PduSessionVsmfUpdateReq)",2:"(VERSION)",3:"(FIELD-COUNT)",4:"(STATUS)",5:"(STATUS-CODE)",
                6:"(REQUEST-INDICATION)",7:"(SESSION-AMBR)",8:"(ALWAYS-ON-GRANTED)",9:"(CAUSE)",10:"(N1SM-CAUSE)",
                11:"(BACKOFF-TIMER)",12:"(N1-REQ-MSG-TYPE)",13:"(N1-RSP-MSG-TYPE)",14:"(N1-PCO)",15:"(N1-QOS-RULE)",
                16:"(N1-QOS-DESC)",17:"(N1-PDU-SESS-ID)",18:"(N1-ALWAYS-ON)",19:"(N1-SESSION-AMBR)"}

event_id1478 = {0:"(PROCEDURE-ID)",1:"(EVENT-ID): (N16PduSessionVsmfUpdateReqClient)",2:"(VERSION)",3:"(FIELD-COUNT)",4:"(STATUS)",5:"(STATUS-CODE)",
                6:"(REQUEST-INDICATION)",7:"(SESSION-AMBR)",8:"(ALWAYS-ON-GRANTED)",9:"(CAUSE)",10:"(N1SM-CAUSE)",
                11:"(BACKOFF-TIMER)",12:"(N1-REQ-MSG-TYPE)",13:"(N1-RSP-MSG-TYPE)",14:"(N1-PCO)",15:"(N1-QOS-RULE)",
                16:"(N1-QOS-DESC)",17:"(N1-PDU-SESS-ID)",18:"(N1-ALWAYS-ON)",19:"(N1-SESSION-AMBR)"}

event_id1458 = {0:"(PROCEDURE-ID)",1:"(EVENT-ID): (N16PduSessionNotifyReq)",2:"(VERSION)",3:"(FIELD-COUNT)",4:"(STATUS)",5:"(STATUS-CODE)",
                6:"(RESOURCE-STATUS)",7:"(CAUSE)"}

event_id1488 = {0:"(PROCEDURE-ID)",1:"(EVENT-ID): (N16PduSessionNotifyReqClient)",2:"(VERSION)",3:"(FIELD-COUNT)",4:"(STATUS)",5:"(STATUS-CODE)",
                6:"(RESOURCE-STATUS)",7:"(CAUSE)"}

event_id2062 = {0:"(PROCEDURE-ID)",1:"(EVENT-ID): (S5S8UpdateBearerReq)",2:"(VERSION)",3:"(FIELD-COUNT)",4:"(STATUS)",5:"(STATUS-CODE)",
                6:"(AMBR)",7:"(BEARER-CTX)",8:"(CAUSE)",9:"(RECOVERY)"}

event_id2059 = {0:"(PROCEDURE-ID)",1:"(EVENT-ID): (S5S8CreateBearerReq)",2:"(VERSION)",3:"(FIELD-COUNT)",4:"(STATUS)",5:"(STATUS-CODE)",
                6:"(LINKED-BEARER-ID)",7:"(PCO)",8:"(BEARER-CTX)",9:"(CAUSE)"}

event_id2061 = {0:"(PROCEDURE-ID)",1:"(EVENT-ID): (S5S8BearerResourceCmd)",2:"(VERSION)",3:"(FIELD-COUNT)",4:"(STATUS)",5:"(STATUS-CODE)",
                6:"(LBI-REQUESTED)",7:"(RAT-TYPE)",8:"(SERVING-PLMN)",9:"(EBI)"}

event_id2064 = {0:"(PROCEDURE-ID)",1:"(EVENT-ID): (S5S8ModifyBearerCmd)",2:"(VERSION)",3:"(FIELD-COUNT)",4:"(STATUS)",5:"(STATUS-CODE)",
                6:"(APN-AMBR)",7:"(BEARER-CTX)",8:"(CAUSE)",9:"(RECOVERY)"}

event_id2053 = {0:"(PROCEDURE-ID)",1:"(EVENT-ID): (S5S8ModifyBearerReq)",2:"(VERSION)",3:"(FIELD-COUNT)",4:"(STATUS)",5:"(STATUS-CODE)",
                6:"(MEI)",7:"(SERVING-PLMN)",8:"(RAT-TYPE)",9:"(FQ_TEID)",10:"(AMBR-REQUESTED)",11:"(MME-S4SGSN-ID)",
                12:"(M-MBR)",13:"(UE-LOCAL-ADDR)",14:"(HENB-LOCAL-ADDR)",15:"(UE-UDP-PORT)",
                16:"(CAUSE)",17:"(RECOVERY)",18:"(LINKED-EBI)",19:"(MSISDN)",20:"(AMBR-RESP)",
                21:"(APN-RESTRICT)",22:"(BEARER-CTX-RESPONDED)"}

event_id1000_3 = {0:"(PROCEDURE-ID)",1:"(EVENT-ID): (metaData)",2:"(VERSION)",3:"(FIELD-COUNT)",4:"(SUPI)",5:"(IMEI/PEI)",
                6:"(IMSI)",7:"(MSISDN)",8:"(GPSI)",9:"(SERVING-PLMN)",10:"(UE-LOCATION)",11:"(START-TIME)",
                12:"(END-TIME)",13:"(TRIGGER-NF)",14:"(TRIGGER-EVENT)",15:"(SGW-ID)",16:"(STATUS)",17:"(USERPLANE-STATUS)",
                18:"(DISCONNECT-REASON)",19:"(DNN/APN)",20:"(RAT-TYPE)",21:"(UE-TIMEZONE)",22:"(PDU/PDN-SESSION-TYPE)",
                23:"(UE-PLMN)",24:"(SUBSCRIBED-SESS-AMBR-UPLINK)",25:"(SUBSCRIBED-SESS-AMBR-DOWNLINK)",
                26:"(SUBSCRIBED-5QI)",27:"(SUBSCRIBED-ARP)",28:"(PAA)",29:"(LOCAL-SEID)",30:"(REMOTE-SEID)",
                31:"(ROAMING-STATUS)",32:"(PDU/PDN-SESSION-ID)",33:"(ALWAYS-ON)",34:"(EPS-IWK)",35:"(S-NSSAI)",
                36:"(MAX-SUPP-FILTERS)",37:"(SSC-MODE)",38:"(UE-TYPE)",39:"(LOCAL-CFTEID-TEID)",40:"(LOCAL-CFTEID-IP)",
                41:"(REMOTE-CFTEID-TEID)",42:"(REMOTE-CFTEID-IP)",43:"(VIRTUAL-DNN/APN)"}

event_id1000_4 = {0:"(PROCEDURE-ID)",1:"(EVENT-ID): (metaData)",2:"(VERSION)",3:"(FIELD-COUNT)",4:"(SUPI)",5:"(IMEI/PEI)",
                6:"(IMSI)",7:"(MSISDN)",8:"(GPSI)",9:"(SERVING-PLMN)",10:"(UE-LOCATION)",11:"(START-TIME)",
                12:"(END-TIME)",13:"(TRIGGER-NF)",14:"(TRIGGER-EVENT)",15:"(SGW-ID)",16:"(STATUS)",
                17:"(USERPLANE-STATUS)",18:"(DISCONNECT-REASON)"}

event_id1000_5 = {0:"(PROCEDURE-ID)",1:"(EVENT-ID): (metaData)",2:"(VERSION)",3:"(FIELD-COUNT)",4:"(SUPI)",5:"(IMEI/PEI)",
                6:"(IMSI)",7:"(MSISDN)",8:"(GPSI)",9:"(SERVING-PLMN)",10:"(UE-LOCATION)",11:"(START-TIME)",
                12:"(END-TIME)",13:"(TRIGGER-NF)",14:"(TRIGGER-EVENT)",15:"(USERPLANE-STATUS)",16:"(SGW-ID)",17:"(DISCONNECT-REASON)",
                18:"(STATUS)",19:"(SUBSCRIBED-SESS-AMBR-UPLINK)",20:"(SUBSCRIBED-SESS-AMBR-DOWNLINK)",
                21:"(ALWAYS-ON)",22:"(MAX-SUPP-FILTERS)",23:"(LOCAL-CFTEID-TEID)",24:"(LOCAL-CFTEID-IP)",
                25:"(REMOTE-CFTEID-TEID)",26:"(REMOTE-CFTEID-IP)"}

event_id1000_6 = {0:"(PROCEDURE-ID)",1:"(EVENT-ID): (metaData)",2:"(VERSION)",3:"(FIELD-COUNT)",4:"(SUPI)",5:"(IMEI/PEI)",
                6:"(IMSI)",7:"(MSISDN)",8:"(GPSI)",9:"(SERVING-PLMN)",10:"(UE-LOCATION)",11:"(START-TIME)",
                12:"(END-TIME)",13:"(TRIGGER-NF)",14:"(TRIGGER-EVENT)",15:"(SGW-ID)",16:"(STATUS)",
                17:"(SUBSCRIBED-SESS-AMBR-UPLINK)",18:"(SUBSCRIBED-SESS-AMBR-DOWNLINK)",19:"(LOCAL-CFTEID-TEID)",
                20:"(LOCAL-CFTEID-IP)",21:"(REMOTE-CFTEID-TEID)",22:"(REMOTE-CFTEID-IP)"}

event_id1000_7 = {0:"(PROCEDURE-ID)",1:"(EVENT-ID): (metaData)",2:"(VERSION)",3:"(FIELD-COUNT)",4:"(SUPI)",5:"(IMEI/PEI)",
                6:"(IMSI)",7:"(MSISDN)",8:"(GPSI)",9:"(SERVING-PLMN)",10:"(UE-LOCATION)",11:"(START-TIME)",
                12:"(END-TIME)",13:"(TRIGGER-NF)",14:"(TRIGGER-EVENT)",15:"(SGW-ID)",16:"(STATUS)",17:"(RAT-TYPE)",
                18:"(UE-TIMEZONE)",19:"(SESS-AMBR-UPLINK)",20:"(SESS-AMBR-DOWNLINK)",21:"(LINKED-EBI)",22:"(USERPLANE-STATUS)",
                23:"(LOCAL-CFTEID-TEID)",24:"(LOCAL-CFTEID-IP)",25:"(LOCAL-CFTEID-IP)",26:"(REMOTE-CFTEID-IP)",27:"(DISCONNECT-REASON)"}

# ------------------------------ Below are the sub fields data for a particular message ------------------------------ #

# --------------------------------------------- N1-N2-Msg-Req-Content ------------------------------------------------ #

n1_n2_msg_req_content = {0:"(msg-type)",1:"(cause)"}

n1_n2_msg_type = {193:"(SMF_MSG_PDU_SESSION_ESTABLISHMENT_REQ)",194:"(SMF_MSG_PDU_SESSION_ESTABLISHMENT_ACCEPT)",
                201:"(SMF_MSG_PDU_SESSION_MODIFICATION_REQUEST)",202:"(SMF_MSG_PDU_SESSION_MODIFICATION_REJECT)",
                203:"(SMF_MSG_PDU_SESSION_MODIFICATION_COMMAND)",204:"(SMF_MSG_PDU_SESSION_MODIFICATION_COMPLETE)",
                209:"(SMF_MSG_PDU_SESSION_RELEASE_REQUEST)",211:"(SMF_MSG_PDU_SESSION_RELEASE_COMMAND)",
                212:"(SMF_MSG_PDU_SESSION_RELEASE_COMPLETE)",195:"(SMF_MSG_PDU_SESSION_ESTABLISHMENT_REJECT)",
                58:"(N2_PDU_SESSION_RESOURCE_MODIFY_CONFIRM_TRANSFER_IE)",
                59:"(N2_PDU_SESSION_RESOURCE_MODIFY_INDICATION_TRANSFER_IE)",
                60:"(N2_PDU_SESSION_RESOURCE_MODIFY_REQUEST_TRANSFER_IE)",
                61:"(N2_PDU_SESSION_RESOURCE_MODIFY_RESPONSE_TRANSFER_IE)",
                62:"(N2_PDU_SESSION_RESOURCE_MODIFY_CONFIRM_TRANSFER)",
                63:"(N2_PDU_SESSION_RESOURCE_MODIFY_INDICATION_TRANSFER)",
                64:"(N2_PDU_SESSION_RESOURCE_MODIFY_REQUEST_TRANSFER)",
                65:"(N2_PDU_SESSION_RESOURCE_MODIFY_RESPONSE_TRANSFER)",
                72:"(N2_PDU_SESSION_RESOURCE_SETUP_REQUEST_TRANSFER_IE)",
                73:"(N2_PDU_SESSION_RESOURCE_SETUP_RESPONSE_TRANSFER_IE)",
                76:"(N2_PDU_SESSION_RESOURCE_RELEASE_COMMAND_TRANSFER)",
                77:"(N2_PDU_SESSION_RESOURCE_SETUP_REQUEST_TRANSFER)",
                78:"(N2_PDU_SESSION_RESOURCE_SETUP_RESPONSE_TRANSFER)",
                79:"(N2_PDU_SESSION_RESOURCE_MODIFY_UNSUCCESS_TRANSFER)",
                80:"(N2_PDU_SESSION_RESOURCE_MODIFY_UNSUCCESS_TRANSFER_IE)",
                81:"(N2_PDU_SESSION_PATH_SWITCH_REQUEST_TRANSFER_IE)",
                82:"(N2_PDU_SESSION_PATH_SWITCH_REQUEST_TRANSFER)",
                83:"(N2_PDU_SESSION_PATH_SWITCH_REQUEST_ACK_TRANSFER_IE)",
                84:"(N2_PDU_SESSION_PATH_SWITCH_REQUEST_ACK_TRANSFER)",
                85:"(N2_PDU_SESSION_HANDOVER_REQUIRED_TRANSFER)",
                86:"(N2_PDU_SESSION_HANDOVER_REQUIRED_TRANSFER_IE)",
                87:"(N2_PDU_SESSION_HANDOVER_REQUEST_ACK_TRANSFER)",
                88:"(N2_PDU_SESSION_HANDOVER_REQUEST_ACK_TRANSFER_IE)",
                89:"(N2_PDU_SESSION_HANDOVER_RESOURCE_ALLOC_UNSUCCESS_TRANSFER)",
                90:"(N2_PDU_SESSION_HANDOVER_RESOURCE_ALLOC_UNSUCCESS_TRANSFER_IE)",
                91:"(N2_PDU_SESSION_HANDOVER_COMMAND_TRANSFER)",
                92:"(N2_PDU_SESSION_HANDOVER_COMMAND_TRANSFER_IE)",
                93:"(N2_PDU_SESSION_HANDOVER_PREP_UNSUCCESS_TRANSFER)",
                94:"(N2_PDU_SESSION_HANDOVER_PREP_UNSUCCESS_TRANSFER_IE)",
                95:"(N2_PDU_SESSION_PATH_SWITCH_REQUEST_SETUP_FAILED_TRANSFER)",
                96:"(N2_PDU_SESSION_PATH_SWITCH_REQUEST_SETUP_FAILED_TRANSFER_IE)",
                97:"(N2_PDU_SESSION_PATH_SWITCH_REQUEST_UNSUCCESS_TRANSFER)",
                98:"(N2_PDU_SESSION_PATH_SWITCH_REQUEST_UNSUCCESS_TRANSFER_IE)",
                99:"(N2_PDU_SESSION_RESOURCE_SETUP_UNSUCCESS_TRANSFER)",
                100:"(N2_PDU_SESSION_RESOURCE_SETUP_UNSUCCESS_TRANSFER_IE)",
                101:"(N2_PDU_SESSION_RESOURCE_NOTIFY_TRANSFER)",
                102:"(N2_PDU_SESSION_RESOURCE_NOTIFY_TRANSFER_IE)",
                103:"(N2_PDU_SESSION_SECONDARY_RAT_USAGE_TRANSFER)",
                104:"(N2_PDU_SESSION_SECONDARY_RAT_USAGE_TRANSFER_IE)",
                105:"(N2_PDU_SESSION_RESOURCE_NOTIFY_RELEASED_TRANSFER)",
                106:"(N2_PDU_SESSION_RESOURCE_NOTIFY_RELEASED_TRANSFER_IE)",
                107:"(N2_PDU_SESSION_RESOURCE_SETUP_FAIL_TRANSFER)",
                108:"(N2_PDU_SESSION_RESOURCE_NOTIFY_RELEASE_TRANSFER)",
                109:"(N2_PDU_SESSION_PATH_SWITCH_SETUP_FAIL_TRANSFER)",
                110:"(N2_PDU_SESSION_HANDOVER_REQUIRED_ACK_TRANSFER)",
                111:"(N2_PDU_SESSION_HANDOVER_RESPONSE_ALLOC_FAIL_TRANSFER)",
                112:"(N2_PDU_SESSION_HANDOVER_RESPONSE_MOD_IND_FAIL_TRANSFER)",
                130:"(N2_PDU_SESSION_RESOURCE_RELEASE_RESPONSE_TRANSFER)",}

# ---------------------------------------------------- n1-pco -------------------------------------------------------- #

n1_pco = {0:"(TYPE)",1:"(PCSCF-ADDR-LIST)",2:"(DNS-ADDR-LIST)",3:"(PDU-SESSION-ID)",4:"(QOS-RULE-LIST)",
        5:"(SESSION-AMBR)",6:"(QOS-DESC)",7:"(S-NSSAI)",8:"(MS-SUPPORT-NW_ADDR-TFT)",9:"(NW-SUPPORT-NW_ADDR-TFT)",
        10:"(PCSCF-ADDR-REQ)",11:"(DNS-ADDR-REQ)",12:"(IPV4-MTU-REQUEST)",13:"(IPV4-MTU-SIZE)"}

pcscf_addr_list = dns_addr = {0:"(ipv4-Primary)",1:"(ipv4-secondary)",2:"(ipv4-tertiary)",3:"(ipv6-Primary)",
                   4:"(ipv6-secondary)",5:"(ipv6-tertiary)"}

dns_addr_req = pcscf_addr_req = {0:"(pco-pcsf-addr-ipv4-req)",1:"(pco-pcsf-addr-ipv6-req)"}

# ------------------------------------------------ qos-rule-data ----------------------------------------------------- #

n1_qos_rule = {0:"(qr-id)",1:"(qr-opcode)",2:"(qr-dqr)",3:"(qr-qfi)",4:"(qr-prededence)",5:"(num-filters)",
               6:"(filters)"}

n1_qos_rule_filters ={0:"(flter-id)",1:"(flter-dir)",2:"(cmp-type-match-all)",3:"(cmp-type-proto)",4:"(proto-id)",
                    5:"(cmp-type-local-addr)",6:"(local-ip)",7:"(local-cmp-type-port)",8:"(local-port)",
                    9:"(cmp-type-remote-addr)",10:"(remote-ip-addr)",11:"(cmp-type-remote-port)",12:"(remote-port)",
                    13:"(cmp-type-tos)",14:"(tos-traffic-class)"}

# ------------------------------------------------- qos desc --------------------------------------------------------- #

n1_qos_desc = {0:"(QFI)",1:"(Opcode)",2:"(5QI)",3:"(ARP)",4:"(MBR-UPLINK)",5:"(MBR-DOWNLINK)",6:"(GBR-UPLINK)",
               7:"(GBR-DOWNLINK)"}

arp_data = {0:"(preEmpCap)",1:"(preEmpVul)",2:"(Prior)"}

# -------------------------------------------------- sess ambr ------------------------------------------------------- #

n1_session_ambr = {0:"(ambr-dl)",1:"(ambr-ul)"}

# ----------------------------------------------------- paa ---------------------------------------------------------- #

n1_paa = {0:"(ipv4-addr)",1:"(ipv6-addr)"}

# ---------------------------------------------------- nssai --------------------------------------------------------- #

n1_s_nssai = {0:"(sst)",1:"(sd)",2:"(hplmnsst)",3:"(hplmnsd)"}

# ---------------------------------------------------- guami --------------------------------------------------------- #

guami_data = {0:"(amf-id)",1:"(PLMN-ID)"}

# -------------------------------------------------- bearer-ctx ------------------------------------------------------ #

bearer_ctx_data = {0:"(ebi/lbi)",1:"(pkt-flow-id)",2:"(cause)",3:"(pco)",4:"(tft)",5:"(fqteid)",6:"(qos-desc)",
                   7:"(charging-id)"}

# ------------------------------------------------- plmn_id_data ----------------------------------------------------- #

plmn_id_data = {0:"(mcc)",1:"(mnc)"}

# ----------------------------------------------- tunnel_info_data --------------------------------------------------- #

tunnel_info_data = {0:"(gtp-teid)",1:"(ipv4-addr)",2:"(ipv6-addr)"}

# ----------------------------------------------- ue_location_data --------------------------------------------------- #

ue_location_data = {0:"(locationType)",1:"(Ecgi: ECGI/Ncgi: NCGI)",2:"(Tai:TAI)"}

# --------------------------------------------------- qfs_data ------------------------------------------------------- #

qfs_data = {0:"(QOS-RULE)",1:"(QOS-DESC)"}

# -------------------------------------------------- ngpa_cause ------------------------------------------------------ #

ngap_cause_data = {0:"(group)", 1:"(value)"}

# ------------------------------------------------ field Functions --------------------------------------------------- #

list_event_id = ['1287', '1290', '1299', '1302', '1304', '1310', '1339', '527', '530', '524', '3335', '3332', '3341', '3338', '1432', '1319', '1313', '1316', '1325', '1322', '1003', '1004', '1005', '3588', '2307', '2055', '2313', '2309', '1307', '542', '3329', '2066', '2051', '2057', '1444', '1468', '1471', '1447', '1477', '1451', '1478', '1458', '1488', '2062', '2059', '2061', '2064', '2053', '1000', '1287.0', '1290.0', '1299.0', '1302.0', '1304.0', '1310.0', '1339.0', '527.0', '530.0', '524.0', '3335.0', '3332.0', '3341.0', '3338.0', '1432.0', '1319.0', '1313.0', '1316.0', '1325.0', '1322.0', '1003.0', '1004.0', '1005.0', '3588.0', '2307.0', '2055.0', '2313.0', '2309.0', '1307.0', '542.0', '3329.0', '2066.0', '2051.0', '2057.0', '1444.0', '1468.0', '1471.0', '1447.0', '1477.0', '1451.0', '1478.0', '1458.0', '1488.0', '2062.0', '2059.0', '2061.0', '2064.0', '2053.0', '1000.0']

def pco(pco_str):
    ''' Process a pco string and add attributes to it.

    Args:
        pco_str (str): A string representing a pco field.

    Returns:
        str: A modified pco string with added attributes. '''
    
    final_list = ""
    pco_list = pco_str.split("|")
    for i in range(len(n1_pco)) :
        if pco_list[i] == "":
            pco_list[i] = n1_pco[i]+ " " + "N/A"
        else:
            pco_list[i] = n1_pco[i] + " " + pco_list[i]
    final_list = pco_list
    final_str = "|".join(final_list)
    for field in pco_list:
        if "(PCSCF-ADDR-LIST)" in field:
            pcscf_addr_list1 = field.replace("(PCSCF-ADDR-LIST) " , "")
            pcscf_addr_list2 = pcscf_addr_list1.split(";")
            if "N/A" not in pcscf_addr_list2:
                for j in range(len(pcscf_addr_list)) :
                    if pcscf_addr_list2[j] == "":
                        pcscf_addr_list2[j] = pcscf_addr_list[j]+ " " + "N/A"
                    else:
                        pcscf_addr_list2[j] = pcscf_addr_list[j] + " " + pcscf_addr_list2[j]
            str = ";".join(pcscf_addr_list2)
            pco_list[1] = "(PCSCF-ADDR-LIST)" + " ->" + str
        if "(DNS-ADDR-LIST)" in field:
            dns_addr_list1 = field.replace("(DNS-ADDR-LIST) " , "")
            dns_addr_list2 = dns_addr_list1.split(";")
            if "N/A" not in dns_addr_list2:
                for k in range(len(dns_addr)) :
                    if dns_addr_list2[k] == "":
                        dns_addr_list2[k] = dns_addr[k]+ " " + "N/A"
                    else:
                        dns_addr_list2[k] = dns_addr[k] + " " + dns_addr_list2[k]
            str1 = ";".join(dns_addr_list2)
            pco_list[2] = "(DNS-ADDR-LIST)" + " ->" + str1

        if "(PCSCF-ADDR-REQ)" in field:
            pcscf_addr_req1 = field.replace("(PCSCF-ADDR-REQ) " , "")
            pcscf_addr_req2 = pcscf_addr_req1.split(";")
            if "N/A" not in pcscf_addr_req2:
                for l in range(len(pcscf_addr_req)) :
                    if pcscf_addr_req2[l] == "":
                        pcscf_addr_req2[l] = pcscf_addr_req[l]+ " " + "N/A"
                    else:
                        pcscf_addr_req2[l] = pcscf_addr_req[l] + " " + pcscf_addr_req2[l]
            str2 = ";".join(pcscf_addr_req2)
            pco_list[10] = "(PCSCF-ADDR-REQ)" + " ->" + str2
        if "(DNS-ADDR-REQ)" in field:
            dns_addr_req1 = field.replace("(DNS-ADDR-REQ) " , "")
            dns_addr_req2 = dns_addr_req1.split(";")
            if "N/A" not in dns_addr_req2:
                for m in range(len(dns_addr_req)) :
                    if dns_addr_req2[m] == "":
                        dns_addr_req2[m] = dns_addr_req[m]+ " " + "N/A"
                    else:
                        dns_addr_req2[m] = dns_addr_req[m] + " " + dns_addr_req2[m]
            str3 = ";".join(dns_addr_req2)
            pco_list[11] = "(DNS-ADDR-REQ)" + " ->" + str3

        if "(QOS-RULE-LIST)" in field:
            qos_rule_list1 = field.replace("(QOS-RULE-LIST) " , "")
            qos_rule_list2 = qos_rule_list1.split(";")
            if "N/A" not in qos_rule_list2:
                for n in range(len(n1_qos_rule)) :
                    if qos_rule_list2[n] == "":
                        qos_rule_list2[n] = n1_qos_rule[n]+ " " + "N/A"
                    else:
                        qos_rule_list2[n] = n1_qos_rule[n] + " " + qos_rule_list2[n]
            for sub_field in qos_rule_list2 :
                if "(filters)" in sub_field :
                    filters_list1 = sub_field.replace("(filters) filters:" , "")
                    filters_list2 = filters_list1.split("_")
                    for o in range(len(n1_qos_rule_filters)) :
                        if filters_list2[o] == "":
                            filters_list2[o] = n1_qos_rule_filters[o]+ " " + "N/A"
                        else:
                            filters_list2[o] = n1_qos_rule_filters[o] + " " + filters_list2[o]
                    sub_str1 = "_".join(filters_list2)
                    qos_rule_list2[6] = "(filters)" + " ->" + sub_str1
            str4 = ";".join(qos_rule_list2)
            pco_list[4] = "(QOS-RULE-LIST)" + " ->" + str4

        if "(SESSION-AMBR)" in field:
            session_ambr_list1 = field.replace("(SESSION-AMBR) " , "")
            session_ambr_list2 = session_ambr_list1.split(";")
            if "N/A" not in session_ambr_list2:
                for p in range(len(n1_session_ambr)) :
                    if session_ambr_list2[p] == "":
                        session_ambr_list2[p] = n1_session_ambr[p]+ " " + "N/A"
                    else:
                        session_ambr_list2[p] = n1_session_ambr[p] + " " + session_ambr_list2[p]
            str5 = ";".join(session_ambr_list2)
            pco_list[5] = "(SESSION-AMBR)" + " ->" + str5
        
        if "(QOS-DESC)" in field:
            qos_desc_list1 = field.replace("(QOS-DESC) " , "")
            qos_desc_list2 = qos_desc_list1.split(";")
            if "N/A" not in qos_desc_list2:
                for q in range(len(n1_qos_desc)) :
                    if qos_desc_list2[q] == "":
                        qos_desc_list2[q] = n1_qos_desc[q]+ " " + "N/A"
                    else:
                        qos_desc_list2[q] = n1_qos_desc[q] + " " + qos_desc_list2[q]
            str6 = ";".join(qos_desc_list2)
            pco_list[6] = "(QOS-DESC)" + " ->" + str6
        
        if "(S-NSSAI)" in field:
            nssai_list1 = field.replace("(S-NSSAI) " , "")
            nssai_list2 = nssai_list1.split(";")
            if "N/A" not in nssai_list2:
                for s in range(len(n1_s_nssai)) :
                    if nssai_list2[s] == "":
                        nssai_list2[s] = n1_s_nssai[s]+ " " + "N/A"
                    else:
                        nssai_list2[s] = n1_s_nssai[s] + " " + nssai_list2[s]
            str7 = ";".join(nssai_list2)
            pco_list[7] = "(S-NSSAI)" + " ->" + str7
    final_str = "|".join(final_list)
    
    return final_str

def msg_req(n1n2_req_str): # This function will take the cell data as parameter (eg:193|N/A)
    ''' Process a n1n2 request string and add attributes to it.

    Args:
        n1n2_req_str (str): A string representing a n1n2 request message field.
    Returns:
        str: A modified n1n2_req_str string with added attributes. '''
    
    final_list = ""
    n1n2_req_list = n1n2_req_str.split("|") # this line will splits the given argument using | as an delimeter
    if int(n1n2_req_list[0]) in n1_n2_msg_type: 
        n1n2_req_list[0] = n1_n2_msg_type[int(n1n2_req_list[0])] + " " + str(n1n2_req_list[0]) # adds the msg type string 
    for i in range(len(n1_n2_msg_req_content)) :
        if n1n2_req_list[i] == "": # if the n1n2_req_list is empty it will adds N/A infront of the field message
            n1n2_req_list[i] = n1_n2_msg_req_content[i]+ " " + "N/A"
        else: # if the n1n2_req_list is not empty it will adds the attribute
            n1n2_req_list[i] = n1_n2_msg_req_content[i] + "->" + " " + n1n2_req_list[i]
    final_list = n1n2_req_list
    final_str = "|".join(final_list)
    return final_str

def qos_rule(qos_rule_str):
    ''' Process a qos rule string and add attributes to it.

    Args:
        qos_rule_str (str): A string representing a qos rule field.

    Returns:
        str: A modified qos rule string with added attributes. '''
    
    final_list = ""
    qos_rule_list = qos_rule_str.split("|")
    for i in range(len(n1_qos_rule)) :
        if qos_rule_list[i] == "":
            qos_rule_list[i] = n1_qos_rule[i]+ " " + "N/A"
        else:
            qos_rule_list[i] = n1_qos_rule[i] + " " + qos_rule_list[i]
    final_list = qos_rule_list
    final_str = "|".join(final_list)
    for field in qos_rule_list:
        if "(filters)" in field:
            qos_rule_filters = field.replace("(filters) filters:" , "")
            qos_rule_filters1 = qos_rule_filters.split(";")
            if "N/A" not in qos_rule_filters1:
                for j in range(len(n1_qos_rule_filters)) :
                    if qos_rule_filters1[j] == "":
                        qos_rule_filters1[j] = n1_qos_rule_filters[j]+ " " + "N/A"
                    else:
                        qos_rule_filters1[j] = n1_qos_rule_filters[j] + " " + qos_rule_filters1[j]
            str = ";".join(qos_rule_filters1)
            qos_rule_list[6] = "(filters)" + " ->" + str
    final_str = "|".join(final_list)
    
    return final_str

def qos_desc(qos_desc_str):
    ''' Process a qos desc string and add attributes to it.

    Args:
        qos_desc_str (str): A string representing a qos desc field.

    Returns:
        str: A modified qos desc string with added attributes. '''
    
    final_list = ""
    qos_desc_list = qos_desc_str.split("|")
    for i in range(len(n1_qos_desc)) :
        if qos_desc_list[i] == "":
            qos_desc_list[i] = n1_qos_desc[i]+ " " + "N/A"
        else:
            qos_desc_list[i] = n1_qos_desc[i] + " " + qos_desc_list[i]
    final_list = qos_desc_list
    final_str = "|".join(final_list)
    for field in qos_desc_list:
        if "(ARP)" in field:
            qos_desc_arp = field.replace("(ARP) " , "")
            qos_desc_arp1 = qos_desc_arp.split(";")
            if "N/A" not in qos_desc_arp1 :
                for j in range(len(arp_data)) :
                    if qos_desc_arp1[j] == "":
                        qos_desc_arp1[j] = arp_data[j]+ " " + "N/A"
                    else:
                        qos_desc_arp1[j] = arp_data[j] + " " + qos_desc_arp1[j]
            str = ";".join(qos_desc_arp1)
            qos_desc_list[3] = "(ARP)" + " ->" + str
    final_str = "|".join(final_list)
    return final_str

def session_ambr(session_ambr_str):
    ''' Process a session ambr string and add attributes to it.

    Args:
        session_ambr_str (str): A string representing a session ambr field.

    Returns:
        str: A modified session ambr string with added attributes. '''
    
    final_list = ""
    session_ambr1 = session_ambr_str.split("|")
    for i in range(len(n1_session_ambr)) :
        if session_ambr1[i] == "":
            session_ambr1[i] = n1_session_ambr[i]+ " " + "N/A"
        else:
            session_ambr1[i] = n1_session_ambr[i] + " " + session_ambr1[i]

    final_list = session_ambr1
    final_str = "|".join(final_list)
    return final_str

def paa(paa_str):
    ''' Process a paa string and add attributes to it.

    Args:
        paa_str (str): A string representing a paa field.

    Returns:
        str: A modified paa string with added attributes. '''
    final_list = ""
    paa1 = paa_str.split("|")
    for i in range(len(n1_paa)) :
        if paa1[i] == "":
            paa1[i] = n1_paa[i]+ " " + "N/A"
        else:
            paa1[i] = n1_paa[i] + " " + paa1[i]
    final_list = paa1
    final_str = "|".join(final_list)
    return final_str

def nssai(nssai_str):
    ''' Process a nssai string and add attributes to it.

    Args:
        nssai_str (str): A string representing a nssai field.

    Returns:
        str: A modified nssai string with added attributes. '''
    
    final_list = ""
    
    nssai1 = nssai_str.split("|")
    try:
        for i in range(len(n1_s_nssai)) :
            if nssai1[i] == "":
                nssai1[i] = n1_s_nssai[i]+ " " + "N/A"
            else:
                nssai1[i] = n1_s_nssai[i] + " " + nssai1[i]
    except:
        nssai1 = nssai_str

    final_list = nssai1
    final_str = "|".join(final_list)
    return final_str

def guami(guami_str):
    ''' Process a guami string and add attributes to it.

    Args:
        guami_str (str): A string representing a guami field.

    Returns:
        str: A modified guami string with added attributes. '''
    
    final_list = ""
    guami1 = guami_str.split("|")
    for i in range(len(guami_data)) :
        if guami1[i] == "":
            guami1[i] = guami_data[i]+ " " + "N/A"
        else:
            guami1[i] = guami_data[i] + " " + guami1[i]
    final_list = guami1
    final_str = "|".join(final_list)
    plmn_list = []
    for field in guami1:
        if "(PLMN-ID)" in field:
            plm_str = field.split(" ")[1]
            plmn_list.append(plm_str)
        if field.isdigit():
            plmn_list.append(str(field))
    plmn_str_final = "(mcc) " + plmn_list[0] + "|" + "(mnc) " + plmn_list[1]
    guami1[1] = "(PLMN-ID) " + "->" + plmn_str_final
    guami1.pop(2)
    final_str = "|".join(final_list)
    return final_str

def bearer_ctx(bearer_ctx_str):
    ''' Process a bearer_ctx string and add attributes to it.

    Args:
        bearer_ctx_str (str): A string representing a bearer_ctx field.

    Returns:
        str: A modified bearer_ctx string with added attributes. '''
    
    final_list = ""
    bearer_ctx_list = bearer_ctx_str.split("|")
    for i in range(len(bearer_ctx_data)) :
        if bearer_ctx_list[i] == "":
            bearer_ctx_list[i] = bearer_ctx_data[i]+ " " + "N/A"
        else:
            bearer_ctx_list[i] = bearer_ctx_data[i] + " " + bearer_ctx_list[i]
    final_list = bearer_ctx_list
    final_str = "|".join(final_list)

    for field in bearer_ctx_list:
        if "(pco)" in field:
            pco_list1 = field.replace("(pco) " , "")
            pco_list2 = pco_list1.split(";")
            if "N/A" not in pco_list2:
                for j in range(len(n1_pco)) :
                    if pco_list2[j] == "":
                        pco_list2[j] = n1_pco[j]+ " " + "N/A"
                    else:
                        pco_list2[j] = n1_pco[j] + " " + pco_list2[j]
            str = ";".join(pco_list2)
            bearer_ctx_list[3] = "(pco)" + " ->" + str
        
        if "(qos-desc)" in field:
            qos_desc1 = field.replace("(qos-desc) " , "")
            qos_desc2 = qos_desc1.split(";")
            if "N/A" not in qos_desc2:
                for k in range(len(n1_qos_desc)) :
                    if qos_desc2[k] == "":
                        qos_desc2[k] = n1_qos_desc[k]+ " " + "N/A"
                    else:
                        qos_desc2[k] = n1_qos_desc[k] + " " + qos_desc2[k]
            str = ";".join(qos_desc2)
            bearer_ctx_list[6] = "(qos-desc)" + " ->" + str

    final_str = "|".join(final_list)
    return final_str

def plmn_id(plmn_id_str):
    ''' Process a plmn id string and add attributes to it.

    Args:
        plmn_id_str (str): A string representing a plmn id field.

    Returns:
        str: A modified plmn id string with added attributes. '''
    
    final_list = ""
    plmn_id_str1 = plmn_id_str.split("|")
    for i in range(len(plmn_id_data)) :
        if plmn_id_str1[i] == "":
            plmn_id_str1[i] = plmn_id_data[i]+ " " + "N/A"
        else:
            plmn_id_str1[i] = plmn_id_data[i] + " " + plmn_id_str1[i]
    final_list = plmn_id_str1
    final_str = "|".join(final_list)
    return final_str

def tunnel_info(tunnel_info_str):
    ''' Process a tunnel id string and add attributes to it.

    Args:
        tunnel_info_str (str): A string representing a tunnel id field.

    Returns:
        str: A modified tunnel id string with added attributes. '''
    
    final_list = ""
    tunnel_info_str1 = tunnel_info_str.split("|")
    for i in range(len(tunnel_info_data)) :
        if tunnel_info_str1[i] == "":
            tunnel_info_str1[i] = tunnel_info_data[i]+ " " + "N/A"
        else:
            tunnel_info_str1[i] = tunnel_info_data[i] + " " + tunnel_info_str1[i]
    final_list = tunnel_info_str1
    final_str = "|".join(final_list)
    return final_str

def ue_location(ue_location_str):
    ''' Process a ue location string and add attributes to it.

    Args:
        ue_location_str (str): A string representing a ue location field.

    Returns:
        str: A modified ue location string with added attributes. '''
    
    final_list = ""
    ue_location_str1 = ue_location_str.split("|")
    for i in range(len(ue_location_data)) :
        if ue_location_str1[i] == "":
            ue_location_str1[i] = ue_location_data[i]+ " " + "N/A"
        else:
            ue_location_str1[i] = ue_location_data[i] + " " + ue_location_str1[i]
    final_list = ue_location_str1
    final_str = "|".join(final_list)
    return final_str

def qfs(qfs_str):
    ''' Process a qfs string and add attributes to it.

    Args:
        qfs_str (str): A string representing a qfs field.

    Returns:
        str: A modified qfs string with added attributes. '''
    
    final_list = ""
    qfs_str1 = qfs_str.split("|")
    for i in range(len(qfs_data)) :
        if qfs_str1[i] == "":
            qfs_str1[i] = qfs_data[i]+ " " + "N/A"
        else:
            qfs_str1[i] = qfs_data[i] + " " + qfs_str1[i]
    final_list = qfs_str1
    final_str = "|".join(final_list)
    return final_str

def ngap_cause(ngap_cause_str):
    ''' Process a ngap cause string and add attributes to it.

    Args:
        ngap_cause_str (str): A string representing a ngap cause field.

    Returns:
        str: A modified ngap cause string with added attributes. '''
    
    final_list = ""
    ngap_cause_str1 = ngap_cause_str.split("|")
    for i in range(len(ngap_cause_data)) :
        if ngap_cause_str1[i] == "":
            ngap_cause_str1[i] = ngap_cause_data[i]+ " " + "N/A"
        else:
            ngap_cause_str1[i] = ngap_cause_data[i] + " " + ngap_cause_str1[i]
    final_list = ngap_cause_str1
    final_str = "|".join(final_list)
    return final_str

def arp(arp_str):
    ''' Process a arp string and add attributes to it.

    Args:
        arp_str (str): A string representing a arp field.

    Returns:
        str: A modified arp string with added attributes. '''
    
    final_list = ""
    arp_str1 = arp_str.split("|")
    for i in range(len(arp_data)) :
        if arp_str1[i] == "":
            arp_str1[i] = arp_data[i]+ " " + "N/A"
        else:
            arp_str1[i] = arp_data[i] + " " + arp_str1[i]
    final_list = arp_str1
    final_str = "|".join(final_list)
    return final_str

# ---------------------------------------- Below are the Event-id's Functions ---------------------------------------- #

def Event_id1287(var: pd.DataFrame, r, c) :
    """
        Process Event ID 1287 attributes in the given DataFrame.

        This function modifies the DataFrame by adding attributes to the Event ID 1287
        values based on specific conditions.

        Args:
            var (pd.DataFrame): The DataFrame to be modified.
            r (int): The row index in the DataFrame.
            c (int): The starting column index in the DataFrame.

        Returns:
            None: The function modifies the DataFrame in-place.
    """
    
    for i in range(len(event_id1287)) :

        if pd.isnull(var.loc[r,c+i]) is False and var.iloc[r,c+i] != "None":
            if i == 14:
                pco_str = pco(var.loc[r,c+i])
                var.iloc[r,c+i] = event_id1287[i] + " ->" + pco_str
            elif i == 15 or i == 16 or i == 17 or i == 18:
                n1_msg_req = msg_req(var.iloc[r,c+i])
                var.iloc[r,c+i] = event_id1287[i] + " ->" + n1_msg_req
            elif i == 23:
                nssai_str = nssai(var.loc[r,c+i])
                var.iloc[r,c+i] = event_id1287[i] + " ->" + nssai_str
            elif i == 24:
                guami_str = guami(var.loc[r,c+i])
                var.iloc[r,c+i] = event_id1287[i] + " ->" + guami_str
            elif i == 30:
                plmn_id_str = plmn_id(var.loc[r,c+i])
                var.iloc[r,c+i] = event_id1287[i] + " ->" + plmn_id_str
            else:
                var.iloc[r,c+i] = event_id1287[i] + " " + str(var.iloc[r,c+i])
        else:
            if i == 21:
                var.iloc[r,c+i] = "--NO DATA--"
            else:
                var.iloc[r,c+i] = event_id1287[i] + " " + "N/A"
        
def Event_id1290(var: pd.DataFrame, r, c) :

    for i in range(len(event_id1290)) :

        if pd.isnull(var.loc[r,c+i]) is False and var.iloc[r,c+i] != "None":
            if i == 11 or i == 12 or i == 13 or i == 14:
                n1_msg_req = msg_req(var.iloc[r,c+i])
                var.iloc[r,c+i] = event_id1290[i] + " ->" + n1_msg_req
            elif i == 15:
                pco_str = pco(var.loc[r,c+i])
                var.iloc[r,c+i] = event_id1290[i] + " ->" + pco_str
            elif i == 16:
                try:
                    qos_rule_str = qos_rule(var.loc[r,c+i])
                    var.iloc[r,c+i] = event_id1290[i] + " ->" + qos_rule_str
                except:
                    qos_rule_str = var.iloc[r,c+i]
            elif i == 17:
                qos_desc_str = qos_desc(var.loc[r,c+i])
                var.iloc[r,c+i] = event_id1290[i] + " ->" + qos_desc_str
            elif i == 29:
                session_ambr_str = session_ambr(var.iloc[r,c+i])
                var.iloc[r,c+i] = event_id1290[i] + " ->" + session_ambr_str
            else:
                var.iloc[r,c+i] = event_id1290[i] + " " + str(var.iloc[r,c+i])
        else:
            var.iloc[r,c+i] = event_id1290[i] + " " + "N/A"

def Event_id1299(var: pd.DataFrame, r, c) :

    for i in range(len(event_id1299)) :

        if pd.isnull(var.loc[r,c+i]) is False and var.iloc[r,c+i] != "None":
            if i == 7 or i == 8 or i == 9 or i == 10:
                n1_msg_req = msg_req(var.iloc[r,c+i])
                var.iloc[r,c+i] = event_id1299[i] + " ->" + n1_msg_req
            elif i == 11:
                pco_str = pco(var.loc[r,c+i])
                var.iloc[r,c+i] = event_id1299[i] + " ->" + pco_str
            elif i == 12:
                try:
                    qos_rule_str = qos_rule(var.loc[r,c+i])
                    var.iloc[r,c+i] = event_id1299[i] + " ->" + qos_rule_str
                except:
                    qos_rule_str = var.iloc[r,c+i]
            elif i == 13:
                qos_desc_str = qos_desc(var.loc[r,c+i])
                var.iloc[r,c+i] = event_id1299[i] + " ->" + qos_desc_str
            elif i == 16:
                session_ambr_str = session_ambr(var.loc[r,c+i])
                var.iloc[r,c+i] = event_id1299[i] + " ->" + session_ambr_str
            elif i == 17:
                paa_str = paa(var.loc[r,c+i])
                var.iloc[r,c+i] = event_id1299[i] + " ->" + paa_str
            elif i == 18:
                nssai_str = nssai(var.loc[r,c+i])
                var.iloc[r,c+i] = event_id1299[i] + " ->" + nssai_str
            else:
                var.iloc[r,c+i] = event_id1299[i] + " " + str(var.iloc[r,c+i])
        else:
            var.iloc[r,c+i] = event_id1299[i] + " " + "N/A"
        
def Event_id1302(var: pd.DataFrame, r, c) :

    for i in range(len(event_id1302)) :

        if pd.isnull(var.loc[r,c+i]) is True or var.iloc[r,c+i] == "None":
            var.iloc[r,c+i] = "N/A" 

        var.iloc[r,c+i] = event_id1302[i] + " " + str(var.iloc[r,c+i])

def Event_id1304(var: pd.DataFrame, r, c) :

    for i in range(len(event_id1304)) :

        if pd.isnull(var.loc[r,c+i]) is True or var.iloc[r,c+i] == "None":
            var.iloc[r,c+i] = "N/A" 

        var.iloc[r,c+i] = event_id1304[i] + " " + str(var.iloc[r,c+i])

def Event_id1310(var: pd.DataFrame, r, c) :

    for i in range(len(event_id1310)) :

        if pd.isnull(var.loc[r,c+i]) is True or var.iloc[r,c+i] == "None":
            var.iloc[r,c+i] = "N/A" 

        var.iloc[r,c+i] = event_id1310[i] + " " + str(var.iloc[r,c+i])

def Event_id1339(var: pd.DataFrame, r, c) :

    for i in range(len(event_id1339)) :

        if pd.isnull(var.loc[r,c+i]) is True or var.iloc[r,c+i] == "None":
            var.iloc[r,c+i] = "N/A" 

        var.iloc[r,c+i] = event_id1339[i] + " " + str(var.iloc[r,c+i])

def Event_id527(var: pd.DataFrame, r, c) :

    for i in range(len(event_id527)) :

        if pd.isnull(var.loc[r,c+i]) is True or var.iloc[r,c+i] == "None":
            var.iloc[r,c+i] = "N/A" 

        var.iloc[r,c+i] = event_id527[i] + " " + str(var.iloc[r,c+i])

def Event_id530(var: pd.DataFrame, r, c) :

    try:
        
        for i in range(len(event_id530)) :

            if pd.isnull(var.loc[r,c+i]) is True or var.iloc[r,c+i] == "None":
                var.iloc[r,c+i] = "N/A" 

            var.iloc[r,c+i] = event_id530[i] + " " + str(var.iloc[r,c+i])
    except:
        pass

def Event_id524(var: pd.DataFrame, r, c) :

    for i in range(len(event_id524)) :

        if pd.isnull(var.loc[r,c+i]) is True or var.iloc[r,c+i] == "None":
            var.iloc[r,c+i] = "N/A" 

        var.iloc[r,c+i] = event_id524[i] + " " + str(var.iloc[r,c+i])

def Event_id3329(var: pd.DataFrame, r, c) :

    for i in range(len(event_id3329)) :
        if pd.isnull(var.loc[r,c+i]) is False and var.iloc[r,c+i] != "None":
            if i == 10:
                qos_desc_str = qos_desc(var.loc[r,c+i])
                var.iloc[r,c+i] = event_id3329[i] + " ->" + qos_desc_str
            elif i == 11:
                session_ambr_str = session_ambr(var.loc[r,c+i])
                var.iloc[r,c+i] = event_id3329[i] + " ->" + session_ambr_str
            else:
                var.iloc[r,c+i] = event_id3329[i] + " " + str(var.iloc[r,c+i])
        else:
            var.iloc[r,c+i] = event_id3329[i] + " " + "N/A"
        
def Event_id3335(var: pd.DataFrame, r, c) :

    for i in range(len(event_id3335)) :

        if pd.isnull(var.loc[r,c+i]) is True or var.iloc[r,c+i] == "None":
            var.iloc[r,c+i] = "N/A" 

        var.iloc[r,c+i] = event_id3335[i] + " " + str(var.iloc[r,c+i])

def Event_id3332(var: pd.DataFrame, r, c) :

    for i in range(len(event_id3332)) :

        if pd.isnull(var.loc[r,c+i]) is True or var.iloc[r,c+i] == "None":
            var.iloc[r,c+i] = "N/A" 

        var.iloc[r,c+i] = event_id3332[i] + " " + str(var.iloc[r,c+i])

def Event_id3341(var: pd.DataFrame, r, c) :

    for i in range(len(event_id3341)) :

        if pd.isnull(var.loc[r,c+i]) is True or var.iloc[r,c+i] == "None":
            var.iloc[r,c+i] = "N/A" 

        var.iloc[r,c+i] = event_id3341[i] + " " + str(var.iloc[r,c+i])

def Event_id3338(var: pd.DataFrame, r, c) :

    for i in range(len(event_id3338)) :

        if pd.isnull(var.loc[r,c+i]) is True or var.iloc[r,c+i] == "None":
            var.iloc[r,c+i] = "N/A" 

        var.iloc[r,c+i] = event_id3338[i] + " " + str(var.iloc[r,c+i])

def Event_id1432(var: pd.DataFrame, r, c) :

    for i in range(len(event_id1432)) :

        if pd.isnull(var.loc[r,c+i]) is True or var.iloc[r,c+i] == "None":
            var.iloc[r,c+i] = "N/A" 

        var.iloc[r,c+i] = event_id1432[i] + " " + str(var.iloc[r,c+i])

def Event_id1319(var: pd.DataFrame, r, c) :

    for i in range(len(event_id1319)) :

        if pd.isnull(var.loc[r,c+i]) is True or var.iloc[r,c+i] == "None":
            var.iloc[r,c+i] = "N/A" 

        var.iloc[r,c+i] = event_id1319[i] + " " + str(var.iloc[r,c+i])

def Event_id1313(var: pd.DataFrame, r, c) :

    for i in range(len(event_id1313)) :

        if pd.isnull(var.loc[r,c+i]) is True or var.iloc[r,c+i] == "None":
            var.iloc[r,c+i] = "N/A" 

        var.iloc[r,c+i] = event_id1313[i] + " " + str(var.iloc[r,c+i])

def Event_id1316(var: pd.DataFrame, r, c) :

    for i in range(len(event_id1316)) :

        if pd.isnull(var.loc[r,c+i]) is True or var.iloc[r,c+i] == "None":
            var.iloc[r,c+i] = "N/A" 

        var.iloc[r,c+i] = event_id1316[i] + " " + str(var.iloc[r,c+i])

def Event_id1325(var: pd.DataFrame, r, c) :

    for i in range(len(event_id1325)) :

        if pd.isnull(var.loc[r,c+i]) is True or var.iloc[r,c+i] == "None":
            var.iloc[r,c+i] = "N/A" 

        var.iloc[r,c+i] = event_id1325[i] + " " + str(var.iloc[r,c+i])

def Event_id2066(var: pd.DataFrame, r, c) :

    for i in range(len(event_id2066)) :

        if pd.isnull(var.loc[r,c+i]) is False and var.iloc[r,c+i] != "None":
            if i == 6 or i == 8 :
                bearer_ctx_str = bearer_ctx(var.iloc[r,c+i])
                var.iloc[r,c+i] = event_id2066[i] + " ->" + bearer_ctx_str
            else:
                var.iloc[r,c+i] = event_id2066[i] + " " + str(var.iloc[r,c+i])
        else:
            var.iloc[r,c+i] = event_id2066[i] + " " + "N/A"
        
def Event_id1322(var: pd.DataFrame, r, c) :

    for i in range(len(event_id1322)) :

        if pd.isnull(var.loc[r,c+i]) is True or var.iloc[r,c+i] == "None":
            var.iloc[r,c+i] = "N/A" 

        var.iloc[r,c+i] = event_id1322[i] + " " + str(var.iloc[r,c+i])

def Event_id1003(var: pd.DataFrame, r, c) :

    for i in range(len(event_id1003)) :

        if pd.isnull(var.loc[r,c+i]) is True or var.iloc[r,c+i] == "None":
            var.iloc[r,c+i] = "N/A" 

        var.iloc[r,c+i] = event_id1003[i] + " " + str(var.iloc[r,c+i])

def Event_id1004(var: pd.DataFrame, r, c) :

    for i in range(len(event_id1004)) :

        if pd.isnull(var.loc[r,c+i]) is True or var.iloc[r,c+i] == "None":
            var.iloc[r,c+i] = "N/A" 

        var.iloc[r,c+i] = event_id1004[i] + " " + str(var.iloc[r,c+i])

def Event_id1005(var: pd.DataFrame, r, c) :

    for i in range(len(event_id1005)) :

        if pd.isnull(var.loc[r,c+i]) is True or var.iloc[r,c+i] == "None":
            var.iloc[r,c+i] = "N/A" 

        var.iloc[r,c+i] = event_id1005[i] + " " + str(var.iloc[r,c+i])

def Event_id3588(var: pd.DataFrame, r, c) :

    for i in range(len(event_id3588)) :

        if pd.isnull(var.loc[r,c+i]) is True or var.iloc[r,c+i] == "None":
            var.iloc[r,c+i] = "N/A" 

        var.iloc[r,c+i] = event_id3588[i] + " " + str(var.iloc[r,c+i])

def Event_id2307(var: pd.DataFrame, r, c) :

    for i in range(len(event_id2307)) :

        if pd.isnull(var.loc[r,c+i]) is True or var.iloc[r,c+i] == "None":
            var.iloc[r,c+i] = "N/A" 

        var.iloc[r,c+i] = event_id2307[i] + " " + str(var.iloc[r,c+i])

def Event_id2051(var: pd.DataFrame, r, c) :

    for i in range(len(event_id2051)) :

        if pd.isnull(var.loc[r,c+i]) is False and var.iloc[r,c+i] != "None":
            if i == 11:
                pco_str = pco(var.loc[r,c+i])
                var.iloc[r,c+i] = event_id2051[i] + " ->" + pco_str
            elif i == 15:
                try:
                    qos_rule_str = qos_rule(var.loc[r,c+i])
                    var.iloc[r,c+i] = event_id2051[i] + " ->" + qos_rule_str
                except:
                    qos_rule_str = var.iloc[r,c+i]
            elif i == 16:
                qos_desc_str = qos_desc(var.loc[r,c+i])
                var.iloc[r,c+i] = event_id2051[i] + " ->" + qos_desc_str
            elif i == 17:
                session_ambr_str = session_ambr(var.loc[r,c+i])
                var.iloc[r,c+i] = event_id2051[i] + " ->" + session_ambr_str
            elif i == 19:
                paa_str = paa(var.loc[r,c+i])
                var.iloc[r,c+i] = event_id2051[i] + " ->" + paa_str
            elif i == 20:
                nssai_str = nssai(var.loc[r,c+i])
                var.iloc[r,c+i] = event_id2051[i] + " ->" + nssai_str
            else:
                var.iloc[r,c+i] = event_id2051[i] + " " + str(var.iloc[r,c+i])
        else:
            var.iloc[r,c+i] = event_id2051[i] + " " + "N/A"
        
def Event_id2057(var: pd.DataFrame, r, c) :

    for i in range(len(event_id2057)) :

        if pd.isnull(var.loc[r,c+i]) is False and var.iloc[r,c+i] != "None":
            if i == 8 or i == 15:
                bearer_ctx_str = bearer_ctx(var.iloc[r,c+i])
                var.iloc[r,c+i] = event_id2057[i] + " ->" + bearer_ctx_str
            else:
                var.iloc[r,c+i] = event_id2057[i] + " " + str(var.iloc[r,c+i])
        else:
            var.iloc[r,c+i] = event_id2057[i] + " " + "N/A"
        
def Event_id2055(var: pd.DataFrame, r, c) :

    for i in range(len(event_id2055)) :

        if pd.isnull(var.loc[r,c+i]) is True or var.iloc[r,c+i] == "None":
            var.iloc[r,c+i] = "N/A" 

        var.iloc[r,c+i] = event_id2055[i] + " " + str(var.iloc[r,c+i])

def Event_id2313(var: pd.DataFrame, r, c) :

    for i in range(len(event_id2313)) :

        if pd.isnull(var.loc[r,c+i]) is True or var.iloc[r,c+i] == "None":
            var.iloc[r,c+i] = "N/A" 

        var.iloc[r,c+i] = event_id2313[i] + " " + str(var.iloc[r,c+i])

def Event_id2309(var: pd.DataFrame, r, c) :

    for i in range(len(event_id2309)) :

        if pd.isnull(var.loc[r,c+i]) is True or var.iloc[r,c+i] == "None":
            var.iloc[r,c+i] = "N/A" 

        var.iloc[r,c+i] = event_id2309[i] + " " + str(var.iloc[r,c+i])

def Event_id1444(var: pd.DataFrame, r, c) :

    for i in range(len(event_id1444)) :

        if pd.isnull(var.loc[r,c+i]) is False and var.iloc[r,c+i] != "None":
            if i == 7:
                guami_str = guami(var.iloc[r,c+i])
                var.iloc[r,c+i] = event_id1444[i] + " ->" + guami_str
            elif i == 14:
                nssai_str = nssai(var.loc[r,c+i])
                var.iloc[r,c+i] = event_id1444[i] + " ->" + nssai_str
            elif i == 15:
                plmn_id_str = plmn_id(var.loc[r,c+i])
                var.iloc[r,c+i] = event_id1444[i] + " ->" + plmn_id_str
            elif i == 17 or i == 25:
                tunnel_info_str = tunnel_info(var.loc[r,c+i])
                var.iloc[r,c+i] = event_id1444[i] + " ->" + tunnel_info_str
            elif i == 21:
                ue_location_str = ue_location(var.loc[r,c+i])
                var.iloc[r,c+i] = event_id1444[i] + " ->" + ue_location_str
            elif i == 26:
                session_ambr_str = session_ambr(var.loc[r,c+i])
                var.iloc[r,c+i] = event_id1444[i] + " ->" + session_ambr_str
            elif i == 29:
                qfs_str = qfs(var.loc[r,c+i])
                var.iloc[r,c+i] = event_id1444[i] + " ->" + qfs_str
            else:
                var.iloc[r,c+i] = event_id1444[i] + " " + str(var.iloc[r,c+i])
        else:
            var.iloc[r,c+i] = event_id1444[i] + " " + "N/A"
        
def Event_id1471(var: pd.DataFrame, r, c) :

    for i in range(len(event_id1471)) :

        if pd.isnull(var.loc[r,c+i]) is False and var.iloc[r,c+i] != "None":
            if i == 8 :
                ngap_cause_str1 = ngap_cause(var.iloc[r,c+i])
                var.iloc[r,c+i] = event_id1471[i] + " ->" + ngap_cause_str1
            else:
                var.iloc[r,c+i] = event_id1471[i] + " " + str(var.iloc[r,c+i])
        else:
            var.iloc[r,c+i] = event_id1471[i] + " " + "N/A"
        
def Event_id1447_3_7(var: pd.DataFrame, r, c) :

    for i in range(len(event_id1447_3_7)) :

        if pd.isnull(var.loc[r,c+i]) is False and var.iloc[r,c+i] != "None":
            if i == 8:
                tunnel_info_str = tunnel_info(var.loc[r,c+i])
                var.iloc[r,c+i] = event_id1447_3_7[i] + " ->" + tunnel_info_str
            elif i == 15:
                ngap_cause_str1 = ngap_cause(var.iloc[r,c+i])
                var.iloc[r,c+i] = event_id1447_3_7[i] + " ->" + ngap_cause_str1
            elif i == 19:
                ue_location_str = ue_location(var.loc[r,c+i])
                var.iloc[r,c+i] = event_id1447_3_7[i] + " ->" + ue_location_str
            else:
                var.iloc[r,c+i] = event_id1447_3_7[i] + " " + str(var.iloc[r,c+i])
        else:
            var.iloc[r,c+i] = event_id1447_3_7[i] + " " + "N/A"

def Event_id1447_4_5(var: pd.DataFrame, r, c) :

    for i in range(len(event_id1447_4_5)) :

        if pd.isnull(var.loc[r,c+i]) is False and var.iloc[r,c+i] != "None":
            if i == 8:
                tunnel_info_str = tunnel_info(var.loc[r,c+i])
                var.iloc[r,c+i] = event_id1447_4_5[i] + " ->" + tunnel_info_str
            elif i == 15:
                ngap_cause_str1 = ngap_cause(var.iloc[r,c+i])
                var.iloc[r,c+i] = event_id1447_4_5[i] + " ->" + ngap_cause_str1
            else:
                var.iloc[r,c+i] = event_id1447_4_5[i] + " " + str(var.iloc[r,c+i])
        else:
            var.iloc[r,c+i] = event_id1447_4_5[i] + " " + "N/A"

def Event_id1477_3_7(var: pd.DataFrame, r, c) :

    for i in range(len(event_id1477_3_7)) :

        if pd.isnull(var.loc[r,c+i]) is False and var.iloc[r,c+i] != "None":
            if i == 8:
                tunnel_info_str = tunnel_info(var.loc[r,c+i])
                var.iloc[r,c+i] = event_id1477_3_7[i] + " ->" + tunnel_info_str
            elif i == 15:
                ngap_cause_str1 = ngap_cause(var.iloc[r,c+i])
                var.iloc[r,c+i] = event_id1477_3_7[i] + " ->" + ngap_cause_str1
            elif i == 19:
                ue_location_str = ue_location(var.loc[r,c+i])
                var.iloc[r,c+i] = event_id1477_3_7[i] + " ->" + ue_location_str
            else:
                var.iloc[r,c+i] = event_id1477_3_7[i] + " " + str(var.iloc[r,c+i])
        else:
            var.iloc[r,c+i] = event_id1477_3_7[i] + " " + "N/A"

def Event_id1477_4_5(var: pd.DataFrame, r, c) :

    for i in range(len(event_id1477_4_5)) :

        if pd.isnull(var.loc[r,c+i]) is False and var.iloc[r,c+i] != "None":
            if i == 8:
                tunnel_info_str = tunnel_info(var.loc[r,c+i])
                var.iloc[r,c+i] = event_id1477_4_5[i] + " ->" + tunnel_info_str
            elif i == 15:
                ngap_cause_str1 = ngap_cause(var.iloc[r,c+i])
                var.iloc[r,c+i] = event_id1477_4_5[i] + " ->" + ngap_cause_str1
            else:
                var.iloc[r,c+i] = event_id1477_4_5[i] + " " + str(var.iloc[r,c+i])
        else:
            var.iloc[r,c+i] = event_id1477_4_5[i] + " " + "N/A"
        
def Event_id1468(var: pd.DataFrame, r, c) :

    for i in range(len(event_id1468)) :

        if pd.isnull(var.loc[r,c+i]) is False and var.iloc[r,c+i] != "None":
            if i == 7:
                guami_str = guami(var.iloc[r,c+i])
                var.iloc[r,c+i] = event_id1468[i] + " ->" + guami_str
            elif i == 14:
                nssai_str = nssai(var.loc[r,c+i])
                var.iloc[r,c+i] = event_id1468[i] + " ->" + nssai_str
            elif i == 15:
                plmn_id_str = plmn_id(var.loc[r,c+i])
                var.iloc[r,c+i] = event_id1468[i] + " ->" + plmn_id_str
            elif i == 17 or i == 25:
                tunnel_info_str = tunnel_info(var.loc[r,c+i])
                var.iloc[r,c+i] = event_id1468[i] + " ->" + tunnel_info_str
            elif i == 21:
                ue_location_str = ue_location(var.loc[r,c+i])
                var.iloc[r,c+i] = event_id1468[i] + " ->" + ue_location_str
            elif i == 26:
                session_ambr_str = session_ambr(var.loc[r,c+i])
                var.iloc[r,c+i] = event_id1468[i] + " ->" + session_ambr_str
            elif i == 29:
                qfs_str = qfs(var.loc[r,c+i])
                var.iloc[r,c+i] = event_id1468[i] + " ->" + qfs_str
            else:
                var.iloc[r,c+i] = event_id1468[i] + " " + str(var.iloc[r,c+i])
        else:
            var.iloc[r,c+i] = event_id1468[i] + " " + "N/A"
        
def Event_id1451(var: pd.DataFrame, r, c) :

    for i in range(len(event_id1451)) :

        if pd.isnull(var.loc[r,c+i]) is False and var.iloc[r,c+i] != "None":
            # n1_msg_req = ""
            if i == 7:
                session_ambr_str = session_ambr(var.loc[r,c+i])
                var.iloc[r,c+i] = event_id1451[i] + " ->" + session_ambr_str
            else:
                var.iloc[r,c+i] = event_id1451[i] + " " + str(var.iloc[r,c+i])
        else:
            var.iloc[r,c+i] = event_id1451[i] + " " + "N/A"

def Event_id1458(var: pd.DataFrame, r, c) :

    for i in range(len(event_id1458)) :

        if pd.isnull(var.loc[r,c+i]) is True or var.iloc[r,c+i] == "None":
            var.iloc[r,c+i] = "N/A" 

        var.iloc[r,c+i] = event_id1458[i] + " " + str(var.iloc[r,c+i])

def Event_id1307(var: pd.DataFrame, r, c) :

    for i in range(len(event_id1307)) :

        if pd.isnull(var.loc[r,c+i]) is True or var.iloc[r,c+i] == "None":
            var.iloc[r,c+i] = "N/A" 

        var.iloc[r,c+i] = event_id1307[i] + " " + str(var.iloc[r,c+i])

def Event_id1478(var: pd.DataFrame, r, c) :

    for i in range(len(event_id1478)) :
        if pd.isnull(var.loc[r,c+i]) is False and var.iloc[r,c+i] != "None":
            if i == 7:
                session_ambr_str = session_ambr(var.loc[r,c+i])
                var.iloc[r,c+i] = event_id1478[i] + " ->" + session_ambr_str
            else:
                var.iloc[r,c+i] = event_id1478[i] + " " + str(var.iloc[r,c+i])
        else:
            var.iloc[r,c+i] = event_id1478[i] + " " + "N/A"

def Event_id1488(var: pd.DataFrame, r, c) :

    for i in range(len(event_id1488)) :

        if pd.isnull(var.loc[r,c+i]) is True or var.iloc[r,c+i] == "None":
            var.iloc[r,c+i] = "N/A" 

        var.iloc[r,c+i] = event_id1488[i] + " " + str(var.iloc[r,c+i])

def Event_id2062(var: pd.DataFrame, r, c) :

    for i in range(len(event_id2062)) :

        if pd.isnull(var.loc[r,c+i]) is False and var.iloc[r,c+i] != "None":
            if i == 7:
                try:
                    bearer_ctx_str = bearer_ctx(var.iloc[r,c+i])
                    var.iloc[r,c+i] = event_id2062[i] + " ->" + bearer_ctx_str
                except:
                    bearer_ctx_str = var.iloc[r,c+i]
            else:
                var.iloc[r,c+i] = event_id2062[i] + " " + str(var.iloc[r,c+i])
        else:
            var.iloc[r,c+i] = event_id2062[i] + " " + "N/A"
        
def Event_id2059(var: pd.DataFrame, r, c) :

    for i in range(len(event_id2059)) :

        if pd.isnull(var.loc[r,c+i]) is False and var.iloc[r,c+i] != "None":
            if i == 8:
                try:
                    bearer_ctx_str = bearer_ctx(var.iloc[r,c+i])
                    var.iloc[r,c+i] = event_id2059[i] + " ->" + bearer_ctx_str
                except:
                    bearer_ctx_str = var.iloc[r,c+i]
            else:
                var.iloc[r,c+i] = event_id2059[i] + " " + str(var.iloc[r,c+i])
        else:
            var.iloc[r,c+i] = event_id2059[i] + " " + "N/A"

def Event_id2061(var: pd.DataFrame, r, c) :

    for i in range(len(event_id2061)) :

        if pd.isnull(var.loc[r,c+i]) is True or var.iloc[r,c+i] == "None":
            var.iloc[r,c+i] = "N/A" 

        var.iloc[r,c+i] = event_id2061[i] + " " + str(var.iloc[r,c+i])

def Event_id2064(var: pd.DataFrame, r, c) :

    for i in range(len(event_id2064)) :

        if pd.isnull(var.loc[r,c+i]) is False and var.iloc[r,c+i] != "None":
            if i == 7:
                bearer_ctx_str = bearer_ctx(var.iloc[r,c+i])
                var.iloc[r,c+i] = event_id2064[i] + " ->" + bearer_ctx_str
            else:
                var.iloc[r,c+i] = event_id2064[i] + " " + str(var.iloc[r,c+i])
        else:
            var.iloc[r,c+i] = event_id2064[i] + " " + "N/A"
        
def Event_id542(var: pd.DataFrame, r, c) :
    
    for i in range(len(event_id542)) :

        if pd.isnull(var.loc[r,c+i]) is True or var.iloc[r,c+i] == "None":
            var.iloc[r,c+i] = "N/A" 

        var.iloc[r,c+i] = event_id542[i] + " " + str(var.iloc[r,c+i])

def Event_id2053(var: pd.DataFrame, r, c) :
    
    for i in range(len(event_id2053)) :

        if pd.isnull(var.loc[r,c+i]) is False and var.iloc[r,c+i] != "None":
            if i == 7:
                plmn_id_str = plmn_id(var.iloc[r,c+i])
                var.iloc[r,c+i] = event_id2053[i] + " ->" + plmn_id_str
            
            elif i == 22:
                try:
                    bearer_ctx_str = bearer_ctx(var.loc[r,c+i])
                    var.iloc[r,c+i] = event_id2053[i] + " ->" + bearer_ctx_str
                except:
                    bearer_ctx_str = var.iloc[r,c+i]
            else:
                var.iloc[r,c+i] = event_id2053[i] + " " + str(var.iloc[r,c+i])
        else:
            var.iloc[r,c+i] = event_id2053[i] + " " + "N/A"

def Event_id1000_3(var: pd.DataFrame, r, c) :
    
    for i in range(len(event_id1000_3)) :

        if pd.isnull(var.loc[r,c+i]) is False and var.iloc[r,c+i] != "None":
            if i == 9 or i == 23:
                plmn_id_str1 = plmn_id(var.iloc[r,c+i])
                var.iloc[r,c+i] = event_id1000_3[i] + " ->" + plmn_id_str1
            elif i == 10:
                ue_location_str1 = ue_location(var.loc[r,c+i])
                var.iloc[r,c+i] = event_id1000_3[i] + " ->" + ue_location_str1
            elif i == 27:
                arp_str1 = arp(var.loc[r,c+i])
                var.iloc[r,c+i] = event_id1000_3[i] + " ->" + arp_str1
            elif i == 28:
                n1_paa_str = paa(var.loc[r,c+i])
                var.iloc[r,c+i] = event_id1000_3[i] + " ->" + n1_paa_str
            elif i == 35:
                nssai_str = nssai(var.loc[r,c+i])
                var.iloc[r,c+i] = event_id1000_3[i] + " ->" + nssai_str
            else:
                var.iloc[r,c+i] = event_id1000_3[i] + " " + str(var.iloc[r,c+i])
        else:
            var.iloc[r,c+i] = event_id1000_3[i] + " " + "N/A"
        
def Event_id1000_4(var: pd.DataFrame, r, c) :
    
    for i in range(len(event_id1000_4)) :

        if pd.isnull(var.loc[r,c+i]) is False and var.iloc[r,c+i] != "None":
            if i == 9:
                plmn_id_str1 = plmn_id(var.iloc[r,c+i])
                var.iloc[r,c+i] = event_id1000_4[i] + " ->" + plmn_id_str1
            elif i == 10:
                ue_location_str1 = ue_location(var.loc[r,c+i])
                var.iloc[r,c+i] = event_id1000_4[i] + " ->" + ue_location_str1
            else:
                var.iloc[r,c+i] = event_id1000_4[i] + " " + str(var.iloc[r,c+i])
        else:
            var.iloc[r,c+i] = event_id1000_4[i] + " " + "N/A"

def Event_id1000_5(var: pd.DataFrame, r, c) :
    
    for i in range(len(event_id1000_5)) :

        if pd.isnull(var.loc[r,c+i]) is False and var.iloc[r,c+i] != "None":
            if i == 9:
                plmn_id_str1 = plmn_id(var.iloc[r,c+i])
                var.iloc[r,c+i] = event_id1000_5[i] + " ->" + plmn_id_str1
            elif i == 10:
                ue_location_str1 = ue_location(var.loc[r,c+i])
                var.iloc[r,c+i] = event_id1000_5[i] + " ->" + ue_location_str1
            else:
                var.iloc[r,c+i] = event_id1000_5[i] + " " + str(var.iloc[r,c+i])
        else:
            var.iloc[r,c+i] = event_id1000_5[i] + " " + "N/A"
        
def Event_id1000_6(var: pd.DataFrame, r, c) :
    
    for i in range(len(event_id1000_6)) :

        if pd.isnull(var.loc[r,c+i]) is False and var.iloc[r,c+i] != "None":
            if i == 9:
                plmn_id_str1 = plmn_id(var.iloc[r,c+i])
                var.iloc[r,c+i] = event_id1000_6[i] + " ->" + plmn_id_str1
            elif i == 10:
                ue_location_str1 = ue_location(var.loc[r,c+i])
                var.iloc[r,c+i] = event_id1000_6[i] + " ->" + ue_location_str1
            else:
                var.iloc[r,c+i] = event_id1000_6[i] + " " + str(var.iloc[r,c+i])
        else:
            var.iloc[r,c+i] = event_id1000_6[i] + " " + "N/A"
        
def Event_id1000_7(var: pd.DataFrame, r, c) :
    
    for i in range(len(event_id1000_7)) :

        if pd.isnull(var.loc[r,c+i]) is False and var.iloc[r,c+i] != "None":
            if i == 9:
                plmn_id_str1 = plmn_id(var.iloc[r,c+i])
                var.iloc[r,c+i] = event_id1000_7[i] + " ->" + plmn_id_str1
            elif i == 10:
                ue_location_str1 = ue_location(var.loc[r,c+i])
                var.iloc[r,c+i] = event_id1000_7[i] + " ->" + ue_location_str1
            else:
                var.iloc[r,c+i] = event_id1000_7[i] + " " + str(var.iloc[r,c+i])
        else:
            var.iloc[r,c+i] = event_id1000_7[i] + " " + "N/A"


# ---------------------------- Function for taking the input from the user(For filtering) ----------------------------- #

def select_input_file_wf():
    edrInputFile = filedialog.askopenfilename()
    file_size = (os.path.getsize(os.path.join(edrLoc, edrInputFile)))/1048576
    if edrInputFile.endswith(".csv"):
        print("The given file is in csv format")

        filename = edrInputFile.split("/") # will splits the given path using '/' as delimeter to get the file name
        dir_list = filename
        print(f"The given file is: {filename[-1]} ({file_size:.2f} MB)")

        print(f"Working on {filename[-1]}" )

        try:
            data = pd.read_csv(edrInputFile, header=None, low_memory=False)
            row_len = len(data)
            approx_time = (row_len/1000)
            print(f"This file will take few minutes to process")
        except:
            max_cols = 0
            with open(edrInputFile, 'r') as f:
                for line in f:
                    num_cols = len(line.split(','))
                    if num_cols > max_cols:
                        max_cols = num_cols
            header_list = [i for i in range(max_cols)]
            data = pd.read_csv(edrInputFile, header=None, names=header_list, low_memory=False)
            row_len = len(data)
            approx_time = (row_len/1000)
            print(f"This file will take few minutes to process")

        l1 = [data, filename[-1]]
        return l1

    elif edrInputFile.endswith(".xlsx"):
        print("The given File is in xlsx format")

        filename = edrInputFile.split("/")
        n = len(filename)
        dir_list = filename

        print(f"The given file is: {filename[-1]}")

        print(f"Working on {filename[-1]}", )
        df = pd.read_excel(edrInputFile, header=None)
        row_len = len(df)
        approx_time = (row_len/1000)
        print(f"This file will take few minutes to process")
        
        l1 = [df, filename[-1]]
        return l1

    else:    
        print("File format not supported!")
        # exit()
    
    # filename = edrInputFile.split("/")
    # n = len(filename)
    # print(f"{filename[n-1]} Completed!")

# ------------------------- Function for using the directory files to process(For filtering) -------------------------- #

def use_dir_files_wf(file, ):
    if file.endswith(".csv"):

        print("This file is in csv format")
        print(f"The file is : {file}")
        
        try:
            df = pd.read_csv(file, header=None, low_memory=False)
            row_len = len(df)
            approx_time = (row_len/1000)
            print(f"This file will take few minutes to process")
        except:
            max_cols = 0
            with open(file, 'r') as f:
                for line in f:
                    num_cols = len(line.split(','))
                    if num_cols > max_cols:
                        max_cols = num_cols
            header_list = [i for i in range(max_cols)]
            df = pd.read_csv(file, header=None, names=header_list, low_memory=False)
            row_len = len(df)
            approx_time = (row_len/1000)
            print(f"This file will take few minutes to process")
        
        l1 = [df, file]
        return l1

    elif file.endswith(".xlsx"):

        print("This file is in xlsx format", )
        print(f"The file is :{file}", )
        df = pd.read_excel(file, header=None)
        row_len = len(df)
        approx_time = (row_len/1000)
        print(f"This file will take few minutes to process")

        l1 = [df, file]
        return l1

    else:
        print("File format not supported!")
        # exit()

# -------------------------- Function for taking the input from the user(without filtering) --------------------------- #

def select_input_file_wof():
    edrInputFile = filedialog.askopenfilename()
    file_size = (os.path.getsize(os.path.join(edrLoc, edrInputFile)))/1048576
    if edrInputFile.endswith(".csv"):
        print("The given file is in csv format")

        filename = edrInputFile.split("/") # will splits the given path using '/' as delimeter to get the file name
        n = len(filename)
        print(f"The given file is: {filename[-1]} ({file_size:.2f} MB)")

        print(f"Working on {filename[-1]}")

        try:
            data = pd.read_csv(edrInputFile, header=None, low_memory=False)
            row_len = len(data)
            approx_time = (row_len/1000)
            print(f"This file will take approximately {approx_time} minutes to process")
        except:
            max_cols = 0
            with open(edrInputFile, 'r') as f:
                for line in f:
                    num_cols = len(line.split(','))
                    if num_cols > max_cols:
                        max_cols = num_cols
            header_list = [i for i in range(max_cols)]
            data = pd.read_csv(edrInputFile, header=None, names=header_list, low_memory=False)
            row_len = len(data)
            approx_time = (row_len/1000)
            print(f"This file will take approximately {approx_time} minutes to process")

        l1 = [data, filename[-1]]
        return l1

    elif edrInputFile.endswith(".xlsx"):
        print("The given File is in xlsx format")

        filename = edrInputFile.split("/")
        n = len(filename)

        print(f"The given file is: {filename[-1]}")

        print(f"Working on {filename[-1]}")
        df = pd.read_excel(edrInputFile, header=None)
        row_len = len(df)
        approx_time = (row_len/1000)
        print(f"This file will take approximately {approx_time} minutes to process")
        
        l1 = [df, filename[-1]]
        return l1

    else:    
        print("File format not supported!", )
        # exit()

# ------------------ Returns dates in between the start and end date including start and end date ------------------ #

def get_date_range(start_date, end_date, ):
    # Convert date strings to datetime objects
    
    date_format = "%Y/%m/%d"

    if start_date != "" and end_date != "":
        start_datetime = datetime.strptime(start_date, date_format)
        end_datetime = datetime.strptime(end_date, date_format)

        # Calculate the date range and append the dates to the date_range list
        date_range = []
        while start_datetime <= end_datetime or start_datetime == end_datetime:
            date_range.append(start_datetime.strftime(date_format))
            start_datetime += timedelta(days=1)
        else:
            print("The start date must be before then the end date", )

        return date_range
    
    elif start_date != "" or end_date == "" :
        date_range = []
        date_range.append(start_date)

        return date_range
    
    elif start_date == "" and end_date != "":
        date_range = []
        date_range.append(end_date)

        return date_range
    
    else:
        return None

# -------------------------------------- Variables to store the featched data -------------------------------------- #

supi_list = []
info_dict = {}
sorted_supi_dict = {}

disconnect_reason_list = []
disconnect_reason_dict = {}

rat_type_list = []
rat_type_dict = {}

snssai_list = []
snssai_dict = {}

dnn_list = []
dnn_dict = {}

edrLoc = Path('.')

# --------------------------------------------------- procedure-ID ------------------------------------------------- #

def procedure_id(df: pd.DataFrame, row, col, current_cell, next_cell):

    # print(next_cell)
    if current_cell == '3' or current_cell == '0.3' :

        if next_cell == "1287" or next_cell == "1287.0" :
            Event_id1287(df, row, col)
        if next_cell == "1290"  or next_cell == "1290.0":
            Event_id1290(df, row, col)
        if next_cell == "1299"  or next_cell == "1299.0":
            Event_id1299(df, row, col)
        if next_cell == "1302"  or next_cell == "1302.0":
            Event_id1302(df, row, col)
        if next_cell == "1310"  or next_cell == "1310.0":
            Event_id1310(df, row, col)
        if next_cell == "527"  or next_cell == "527.0":
            Event_id527(df, row, col)
        if next_cell == "530"  or next_cell == "530.0":
            Event_id530(df, row, col)
        if next_cell == "524"  or next_cell == "524.0":
            Event_id524(df, row, col)
        if next_cell == "3329"  or next_cell == "3329.0":
            Event_id3329(df, row, col)
        if next_cell == "3335"  or next_cell == "3335.0":
            Event_id3335(df, row, col)
        if next_cell == "3332"  or next_cell == "3332.0":
            Event_id3332(df, row, col)
        if next_cell == "1432"  or next_cell == "1432.0":
            Event_id1432(df, row, col)
        if next_cell == "1319"  or next_cell == "1319.0":
            Event_id1319(df, row, col)
        if next_cell == "1313"  or next_cell == "1313.0":
            Event_id1313(df, row, col)
        if next_cell == "1316"  or next_cell == "1316.0":
            Event_id1316(df, row, col)
        if next_cell == "1325"  or next_cell == "1325.0":
            Event_id1325(df, row, col)
        if next_cell == "1003"  or next_cell == "1003.0":
            Event_id1003(df, row, col)
        if next_cell == "1004"  or next_cell == "1004.0":
            Event_id1004(df, row, col)
        if next_cell == "1005"  or next_cell == "1005.0":
            Event_id1005(df, row, col)
        if next_cell == "3588"  or next_cell == "3588.0":
            Event_id3588(df, row, col)
        if next_cell == "2307"  or next_cell == "2307.0":
            Event_id2307(df, row, col)
        if next_cell == "2051"  or next_cell == "2051.0":
            Event_id2051(df, row, col)
        if next_cell == "2309"  or next_cell == "2309.0":
            Event_id2309(df, row, col)
        if next_cell == "1444"  or next_cell == "1444.0":
            Event_id1444(df, row, col)
        if next_cell == "1471"  or next_cell == "1471.0":
            Event_id1471(df, row, col)
        if next_cell == "1447"  or next_cell == "1447.0":
            Event_id1447_3_7(df, row, col)
        if next_cell == "1477"  or next_cell == "1477.0":
            Event_id1477_3_7(df, row, col)
        if next_cell == "1468"  or next_cell == "1468.0":
            Event_id1468(df, row, col)
        if next_cell == "1451"  or next_cell == "1451.0":
            Event_id1451(df, row, col)
        if next_cell == "1307"  or next_cell == "1307.0":
            Event_id1307(df, row, col)
        if next_cell == "1478"  or next_cell == "1478.0":
            Event_id1478(df, row, col)
        if next_cell == "1000"  or next_cell == "1000.0":
            Event_id1000_3(df, row, col)

    if current_cell == '4' or current_cell == '0.4' :

        if next_cell == "1290"  or next_cell == "1290.0":
            Event_id1290(df, row, col)
        if next_cell == "1299"  or next_cell == "1299.0":
            Event_id1299(df, row, col)
        if next_cell == "1304"  or next_cell == "1304.0":
            Event_id1304(df, row, col)
        if next_cell == "1310"  or next_cell == "1310.0":
            Event_id1310(df, row, col)
        if next_cell == "1339"  or next_cell == "1339.0":
            Event_id1339(df, row, col)
        if next_cell == "527" or next_cell == "527.0":
            Event_id527(df, row, col)
        if next_cell == "530" or next_cell == "530.0":
            Event_id530(df, row, col)
        if next_cell == "3335"  or next_cell == "3335.0":
            Event_id3335(df, row, col)
        if next_cell == "3341"  or next_cell == "3341.0":
            Event_id3341(df, row, col)
        if next_cell == "1432"  or next_cell == "1432.0":
            Event_id1432(df, row, col)
        if next_cell == "1325"  or next_cell == "1325.0":
            Event_id1325(df, row, col)
        if next_cell == "1322"  or next_cell == "1322.0":
            Event_id1322(df, row, col)
        if next_cell == "1005"  or next_cell == "1005.0":
            Event_id1005(df, row, col)
        if next_cell == "3588"  or next_cell == "3588.0":
            Event_id3588(df, row, col)
        if next_cell == "2057"  or next_cell == "2057.0":
            Event_id2057(df, row, col)
        if next_cell == "2055"  or next_cell == "2055.0":
            Event_id2055(df, row, col)
        if next_cell == "2313"  or next_cell == "2313.0":
            Event_id2313(df, row, col)
        if next_cell == "2309"  or next_cell == "2309.0":
            Event_id2309(df, row, col)
        if next_cell == "1471"  or next_cell == "1471.0":
            Event_id1471(df, row, col)
        if next_cell == "1447"  or next_cell == "1447.0":
            Event_id1447_4_5(df, row, col)
        if next_cell == "1477"  or next_cell == "1477.0":
            Event_id1477_4_5(df, row, col)
        if next_cell == "1451"  or next_cell == "1451.0":
            Event_id1451(df, row, col)
        if next_cell == "1458"  or next_cell == "1458.0":
            Event_id1458(df, row, col)
        if next_cell == "1307"  or next_cell == "1307.0":
            Event_id1307(df, row, col)
        if next_cell == "1478"  or next_cell == "1478.0":
            Event_id1478(df, row, col)
        if next_cell == "1488"  or next_cell == "1488.0":
            Event_id1488(df, row, col)
        if next_cell == "1000"  or next_cell == "1000.0":
            Event_id1000_4(df, row, col)

    if current_cell == '5' or current_cell == '0.5' :

        if next_cell == "1290"  or next_cell == "1290.0":
            Event_id1290(df, row, col)
        if next_cell == "1299"  or next_cell == "1299.0":
            Event_id1299(df, row, col)
        if next_cell == "1302"  or next_cell == "1302.0":
            Event_id1302(df, row, col)
        if next_cell == "527" or next_cell == "527.0":
            Event_id527(df, row, col)
        if next_cell == "3332"  or next_cell == "3332.0":
            Event_id3332(df, row, col)
        if next_cell == "3338"  or next_cell == "3338.0":
            Event_id3338(df, row, col)
        if next_cell == "1322"  or next_cell == "1322.0":
            Event_id1322(df, row, col)
        if next_cell == "1003"  or next_cell == "1003.0":
            Event_id1003(df, row, col)
        if next_cell == "1004"  or next_cell == "1004.0":
            Event_id1004(df, row, col)
        if next_cell == "1005"  or next_cell == "1005.0":
            Event_id1005(df, row, col)
        if next_cell == "3588"  or next_cell == "3588.0":
            Event_id3588(df, row, col)
        if next_cell == "2309"  or next_cell == "2309.0":
            Event_id2309(df, row, col)
        if next_cell == "1447"  or next_cell == "1447.0":
            Event_id1447_4_5(df, row, col)
        if next_cell == "1477"  or next_cell == "1477.0":
            Event_id1477_4_5(df, row, col)
        if next_cell == "1451"  or next_cell == "1451.0":
            Event_id1451(df, row, col)
        if next_cell == "1478"  or next_cell == "1478.0":
            Event_id1478(df, row, col)
        if next_cell == "1000"  or next_cell == "1000.0":
            Event_id1000_5(df, row, col)
    
    if current_cell == '6' or current_cell == '0.6' :

        if next_cell == "527" or next_cell == "527.0":
            Event_id527(df, row, col)
        if next_cell == "3332"  or next_cell == "3332.0":
            Event_id3332(df, row, col)
        if next_cell == "3338"  or next_cell == "3338.0":
            Event_id3338(df, row, col)
        if next_cell == "2066"  or next_cell == "2066.0":
            Event_id2066(df, row, col)
        if next_cell == "1322"  or next_cell == "1322.0":
            Event_id1322(df, row, col)
        if next_cell == "2057"  or next_cell == "2057.0":
            Event_id2057(df, row, col)
        if next_cell == "1451"  or next_cell == "1451.0":
            Event_id1451(df, row, col)
        if next_cell == "1478"  or next_cell == "1478.0":
            Event_id1478(df, row, col)
        if next_cell == "2062"  or next_cell == "2062.0":
            Event_id2062(df, row, col)
        if next_cell == "2059"  or next_cell == "2059.0":
            Event_id2059(df, row, col)
        if next_cell == "2061"  or next_cell == "2061.0":
            Event_id2061(df, row, col)
        if next_cell == "2064"  or next_cell == "2064.0":
            Event_id2064(df, row, col)
        if next_cell == "1000"  or next_cell == "1000.0":
            Event_id1000_6(df, row, col)

    if current_cell == '7' or current_cell == '0.7' :

        if next_cell == "1287"  or next_cell == "1287.0":
            Event_id1287(df, row, col)
        if next_cell == "1290"  or next_cell == "1290.0":
            Event_id1290(df, row, col)
        if next_cell == "1299"  or next_cell == "1299.0":
            Event_id1299(df, row, col)
        if next_cell == "1302"  or next_cell == "1302.0":
            Event_id1302(df, row, col)
        if next_cell == "1310"  or next_cell == "1310.0":
            Event_id1310(df, row, col)
        if next_cell == "527"  or next_cell == "527.0":
            Event_id527(df, row, col)
        if next_cell == "3332"  or next_cell == "3332.0":
            Event_id3332(df, row, col)
        if next_cell == "3338"  or next_cell == "3338.0":
            Event_id3338(df, row, col)
        if next_cell == "2066"  or next_cell == "2066.0":
            Event_id2066(df, row, col)
        if next_cell == "1003"  or next_cell == "1003.0":
            Event_id1003(df, row, col)
        if next_cell == "1004"  or next_cell == "1004.0":
            Event_id1004(df, row, col)
        if next_cell == "1005"  or next_cell == "1005.0":
            Event_id1005(df, row, col)
        if next_cell == "2051"  or next_cell == "2051.0":
            Event_id2051(df, row, col)
        if next_cell == "2057"  or next_cell == "2057.0":
            Event_id2057(df, row, col)
        if next_cell == "2055"  or next_cell == "2055.0":
            Event_id2055(df, row, col)
        if next_cell == "2309"  or next_cell == "2309.0":
            Event_id2309(df, row, col)
        if next_cell == "1444"  or next_cell == "1444.0":
            Event_id1444(df, row, col)
        if next_cell == "1447"  or next_cell == "1447.0":
            Event_id1447_3_7(df, row, col)
        if next_cell == "1477"  or next_cell == "1477.0":
            Event_id1477_3_7(df, row, col)
        if next_cell == "1468"  or next_cell == "1468.0":
            Event_id1468(df, row, col)
        if next_cell == "1307"  or next_cell == "1307.0":
            Event_id1307(df, row, col)
        if next_cell == "2062"  or next_cell == "2062.0":
            Event_id2062(df, row, col)
        if next_cell == "2059"  or next_cell == "2059.0":
            Event_id2059(df, row, col)
        if next_cell == "542"  or next_cell == "1287.0":
            Event_id542(df, row, col)
        if next_cell == "2053"  or next_cell == "1287.0":
            Event_id2053(df, row, col)
        if next_cell == "1000"  or next_cell == "1000.0":
            Event_id1000_7(df, row, col)

def fetch_data(current_cell, transaction_id, row_data : list):

    if current_cell != "(Subscriber-ID) N/A" and current_cell not in supi_list:
        supi_list.append(current_cell)
        info_dict[current_cell] = {}

    if current_cell in supi_list:
        info_dict[current_cell][transaction_id] = []
        info_dict[current_cell][transaction_id].extend(row_data)

def fetch_other_data(current_cell, transaction_id, row_data : list, var_list : list, var_dict : dict, subscriber_id):

    if current_cell not in var_list:
        var_list.append(current_cell)
        var_dict[current_cell] = {}
    
    if current_cell in var_list:
        var_dict[current_cell][subscriber_id] = {}

    if current_cell in var_list:
        var_dict[current_cell][subscriber_id][transaction_id] = []
        var_dict[current_cell][subscriber_id][transaction_id].extend(row_data)

# ---------------------------------------------- function: process_file ------------------------------------------------ #

def process_file(df: pd.DataFrame , dir: str):
    
    ''' This function will take the dataframe and the file name and will process the file '''
    print("inside process_file")

    len_df = len(df)
    for row in range(len_df) :
        print(row)
        
        for col in df :
            current_cell = df.iloc[row, col]
            if col +1 < df.shape[1]:
                next_cell = df.iloc[row, col + 1]
            else:
                next_cell = None

            # Check if the current cell is a float
            if isinstance(current_cell, (float, np.float64)) and not np.isnan(current_cell):
                current_cell = str(int(current_cell))  # Convert non-NaN float to int and then to string

            # Convert to string
            current_cell = str(current_cell)
            if next_cell != None:
                if isinstance(next_cell, (float, np.float64)) and not np.isnan(next_cell):
                    next_cell = str(int(next_cell))  # Convert non-NaN float to int and then to string

                # Convert to string
                next_cell = str(next_cell)

            # print(current_cell)
            if col < len(version1) :
                if pd.isnull(current_cell) is False:
                    df.iloc[row,col] = version1[col] + " " + str(current_cell)
                else:
                    df.iloc[row,col] = version1[col] + " " + "N/A"

    # ----------------------------------- Procedure Id - 3, 4, 5, 6, 7 ---------------------------------------------- #

            if current_cell in ['3', '4', '5', '6', '7']:
                # print(current_cell)
                if next_cell in list_event_id:
                    # print(current_cell, next_cell)
                    procedure_id(df, row, col, current_cell, next_cell)

    # ----------------------------------------- supi data (info_dict) ----------------------------------------------- #
        
        transaction_id = str(df.iloc[row,2])
        row_data = df.iloc[row, :].squeeze().dropna().tolist()
        subscriber_id = str(df.iloc[row,5])
        # print('Row data:',row_data,'\n')
        for col in df:
            current_cell = str(df.iloc[row, col])

            if current_cell.startswith("(Subscriber-ID)"):
                fetch_data(current_cell, transaction_id, row_data)

            if current_cell.startswith("(DISCONNECT-REASON)"):
                if current_cell != "(DISCONNECT-REASON) N/A" and current_cell != "(DISCONNECT-REASON) 5" and current_cell != "(DISCONNECT-REASON) 1" and current_cell != "(DISCONNECT-REASON) 2" and current_cell != "(DISCONNECT-REASON) 3" and current_cell != "(DISCONNECT-REASON) 4":
                    fetch_other_data(current_cell, transaction_id, row_data, disconnect_reason_list, disconnect_reason_dict, subscriber_id)

            if current_cell.startswith("(RAT-TYPE)"):
                if current_cell != "(RAT-TYPE) N/A" and current_cell != "(RAT-TYPE) 6" and current_cell != "(RAT-TYPE) 6.0":
                    fetch_other_data(current_cell, transaction_id, row_data, rat_type_list, rat_type_dict, subscriber_id)
                
            if current_cell.startswith("(S-NSSAI)"):
                if current_cell != "(S-NSSAI) N/A":
                    fetch_other_data(current_cell, transaction_id, row_data, snssai_list, snssai_dict, subscriber_id)

            if current_cell.startswith("(N1-DNN/APN)") or current_cell.startswith("(DNN/APN)"):
                if current_cell != "(N1-DNN/APN) N/A" or current_cell != "(DNN/APN) N/A":
                    fetch_other_data(current_cell, transaction_id, row_data, dnn_list, dnn_dict, subscriber_id)

    sort_info_dict()
    # attribute_dir = "result_edr_" + dir
    # df.to_csv(attribute_dir, header=None , index=False)
    # print("Process Done!")

    # zip_result_files()
    # del_attribute_files()
    # sort_info_dict()

# ------------------------------------- Process the SUPI data that the user gave --------------------------------------- #

def supi_fetch(data: pd.DataFrame, supi: int, file_name: str, ):

    ''' This function will take the dataframe, supi that the user gave and the file name and will process the file'''

    df = pd.DataFrame()
    
    supi_count = 0

    for row in range(len(data)):
        # print(row)
        row_data = data.iloc[row]
        supi_data = str(data.iloc[row,5])
        if supi in supi_data:
            supi_count += 1
            warnings.filterwarnings("ignore", category=FutureWarning)
            df = df.append(pd.Series(row_data, name=row), ignore_index=False)

    if supi_count > 0:
        df = df.drop_duplicates()
        df.to_csv("output_file.csv", header=None, index=False)
        df = pd.read_csv("output_file.csv", header=None, low_memory=False)
        process_file(df, file_name)
    else:
        print("----------------------------------------------------------------------", )
        print("The data was not found in the file for the given supi!", )
        print("----------------------------------------------------------------------", )
        exit()

# ------------------------------- Process the SUPI data and the Date that the user give -------------------------------- #

# def supi_date_fetch(data: pd.DataFrame, supi: int, file_name: str, start_date: str, end_date: str):

# # Note: This Function will only be called if the user gives both supi and date!

#     ''' This function will take the dataframe, supi, filename, date that 
#         the user gave and will fetch the data according to the data given by the user '''

#     df = pd.DataFrame()
    
#     date_range = get_date_range(start_date, end_date, ) # gets the dates in between the start and end dates given
#     print("date range is:", date_range)

#     supi_count = 0
#     date_count = 0

#     # Below loop will break if supi_count is greater than 0 if not it will search for the supi and will update the supi_count

#     for row in range(len(data)):
#         if supi_count > 0:
#             break
#         supi_data = str(data.iloc[row,5])
#         if supi in supi_data:
#             supi_count += 1
        
    
#     # if the date_range is not having any date then consider date_count is 0

#     if len(date_range) != 0:
    
#         # Below loop will break if date_count is greater than 0 if not it will search for the date and will update the date_count

#         for row in range(len(data)):
#             if date_count > 0:
#                 break
#             date_cell = str(data.iloc[row,3])
#             if date_cell[:10] in date_range:
#                 date_count += 1
        
#     if supi_count == 0 and date_count == 0:
#         print("----------------------------------------------------------------------")
#         print("The data was not found in the file for the given supi and date!")
#         exit()

#     if supi_count > 0 and date_count > 0:
#         for row in range(len(data)):
#             print(row)
#             date_cell = str(data.iloc[row,3])
#             row_data = data.iloc[row]
#             supi_data = str(data.iloc[row,5])
#             if supi in supi_data and date_cell[:10] in date_range: # Checking if the supi in supi_data and date in the date_range, if yes the entire row will be appended to new df
#                 warnings.filterwarnings("ignore", category = FutureWarning)
#                 df = df.append(pd.Series(row_data, name=row), ignore_index=False)
            
#     elif supi_count > 0 and date_count == 0:
#         print("----------------------------------------------------------------------")
#         print("The TOD data was not found in the file for the given date. Considering only supi")
#         for row in range(len(data)):
#             print(row)
#             row_data = data.iloc[row]
#             supi_data = str(data.iloc[row,5])
#             if supi in supi_data : # Checking if the cell data is supi, if yes the entire row will be appended to new df
#                 warnings.filterwarnings("ignore", category = FutureWarning)
#                 df = df.append(pd.Series(row_data, name=row), ignore_index=False)
    
#     elif supi_count == 0 and date_count > 0:
#         print("----------------------------------------------------------------------")
#         print("The data was not found in the file for the given supi. Considering only date")
#         for row in range(len(data)):
#             print(row)
#             date_cell = str(data.iloc[row,3])
#             row_data = data.iloc[row]
#             if date_cell[:10] in date_range: # Checking if the row has the given date, if yes the entire row will be appended to new df
#                 warnings.filterwarnings("ignore", category = FutureWarning)
#                 df = df.append(pd.Series(row_data, name=row), ignore_index=False)

#     df = df.drop_duplicates()
#     df.to_csv("output_file.csv", header=None, index=False)
#     df = pd.read_csv("output_file.csv", header=None, low_memory=False)
#     process_file(df, file_name)
#     # os.remove("output_file.csv")

# ---------------------------------------- Process the Date that the user gave ----------------------------------------- #

def date_fetch(data: pd.DataFrame, file_name: str, start_date: str, end_date: str):
   
    # Note: This Function will only be called if the user gives date only!

    ''' This function will take the dataframe, filename, date that 
        the user give and will fetch the data according to the data '''

    date_df = pd.DataFrame()

    date_range = get_date_range(start_date, end_date, ) # gets the dates in between the start and end dates
    # print(date_range)

    date_count = 0
    
    if len(date_range) == 0:
        print("----------------------------------------------------", )
        print("Invalid Date!", )
        print("----------------------------------------------------", )
        return

    for row in range(len(data)):
        if date_count > 0:
            break
        date_cell = str(data.iloc[row,3])
        # print(date_cell)
        if date_cell[:10] in date_range:
            date_count += 1

    # print(date_count, )

    if date_count == 0:
        print("----------------------------------------------------------------------")
        print("The TOD data was not found in the file for the given date!")
        exit()

    for row in range(len(data)):
        date_cell = str(data.iloc[row,3])
        row_data = data.iloc[row]
        if date_count > 0:
            if date_cell[:10] in date_range: # Checking if the date_cell is in date_range, if yes the entire row will be appended to new date_df
                warnings.filterwarnings("ignore", category=FutureWarning)
                date_df = date_df.append(pd.Series(row_data, name=row), ignore_index=False)

    date_df = date_df.drop_duplicates()
    # date_df.to_csv("output_file.csv", header=None, index=False)
    # date_df = pd.read_csv("output_file.csv", header=None, low_memory=False)
    # print(len(date_df))
    process_file(date_df, file_name)

# ------------------------------------------ fetch the disconnect cause data ------------------------------------------- #

def disconnet_cause_fetch(data: pd.DataFrame, file_name: str, diss_cause: str, ):

# Note: This Function will only be called if the user gives both supi and date!

    ''' This function will take the dataframe, supi, filename, date that 
        the user gave and will fetch the data according to the data given by the user '''
    
    df = pd.DataFrame()
    diss_cause_count = 0

    print(diss_cause)

    if ',' in diss_cause:
        interface_err_code = diss_cause.split(',')
        print("----------------------------------------------------------------------")
        print("Project is in progress for N1 and N2 messages! Have a look for N4 messages")
        print("----------------------------------------------------------------------")
        exit()

    elif '$' in diss_cause and ',' not in diss_cause:

        # print("------- $ found -------------")
        interface_err_code = diss_cause.split('$')
        print(interface_err_code)
        for row in range(len(data)):
            print(f"Row num: {row}")
            for col in data:
                row_data = data.iloc[row]
                event_id_cell = str(data.iloc[row,col])
                # if str(interface_err_code[0]) == "N4":
                if event_id_cell in ['524', '527', '530']: # For N4 messages
                    if str(interface_err_code[1]) in str(data.iloc[row, col+4]):
                        diss_cause_count += 1
                        warnings.filterwarnings("ignore", category=FutureWarning)
                        df = df.append(pd.Series(row_data, name=row), ignore_index=False)
    
    else:
        print("No Interface selected! Filtering N4 causes")
        for row in range(len(data)):
            print(f"Row num: {row}")
            for col in data:
                row_data = data.iloc[row]
                event_id_cell = str(data.iloc[row,col])
                # if str(interface_err_code[0]) == "N4":
                if event_id_cell in ['524', '527', '530']:
                    if "Failed" in str(data.iloc[row, col+3]):
                        diss_cause_count += 1
                        warnings.filterwarnings("ignore", category=FutureWarning)
                        df = df.append(pd.Series(row_data, name=row), ignore_index=False)

    if diss_cause_count > 0:
        df = df.drop_duplicates()
        df.to_csv("output_file.csv", header=None, index=False)
        df = pd.read_csv("output_file.csv", header=None, low_memory=False)
        process_file(df, file_name)

    else:
        print("----------------------------------------------------------------------")
        print("The data was not found in the file for the given Disconnect Cause!")
        print("----------------------------------------------------------------------")
        exit()
        
# --------------------------------------------- Zipping the Attribute files -------------------------------------------- #

def zip_result_files():
    # print("ziping.........")
    files = os.listdir()

    result_files = [f for f in files if f.startswith("result_edr_")]

    with zipfile.ZipFile("Attribute_files.zip", 'w') as myzip:
        if len(result_files) != 0:
            for file in result_files:
                myzip.write(file)

# ------------------------------- Delete the attribute files from the current Directory -------------------------------- #

def del_attribute_files():
    for file_name in os.listdir('.'):
        if file_name.startswith('result_edr_') and file_name.endswith('.csv'):
            os.remove(file_name)
        if file_name == "output_file.csv":
            os.remove(file_name)

# ---------- Sort the info_dict dictionary according to the date and time also eliminate the floating values ----------- #

def sort_info_dict():
    try:
        for outer_key, inner_dict in info_dict.items():
            sorted_inner_dict = {
                inner_key: inner_dict[inner_key]
                for inner_key in sorted(inner_dict, key=lambda k: datetime.datetime.strptime(inner_dict[k][3], "(Start-Time) %Y/%m/%d %H:%M:%S.%f"))
            }
            sorted_supi_dict[outer_key] = sorted_inner_dict
    except:
        try:
            for outer_key, inner_dict in info_dict.items():
                sorted_inner_dict = {
                    inner_key: inner_dict[inner_key]
                    for inner_key in sorted(inner_dict, key=lambda k: datetime.datetime.strptime(inner_dict[k][3], "(Start-Time) %Y/%m/%d %H:%M:%S"))
                }
                sorted_supi_dict[outer_key] = sorted_inner_dict
        except:
            pass

    if len(sorted_supi_dict) == 0:
        for supi, transactions in info_dict.items():
            new_dict = {}
            # Iterate over the transactions for each supi
            for transaction_id, values in transactions.items():
                # Remove ".0" from transaction ID
                new_transaction_id = str(transaction_id).replace(".0", "")

                new_values = []
                # Iterate over the values and remove ".0"
                for value in values:
                    new_value = str(value).replace(".0", "")
                    new_values.append(new_value)

                new_dict[new_transaction_id] = new_values

            info_dict[supi] = new_dict

    else:
        for supi, transactions in sorted_supi_dict.items():
            new_dict = {}
            # Iterate over the transactions for each supi
            for transaction_id, values in transactions.items():
                # Remove ".0" from transaction ID
                new_transaction_id = str(transaction_id).replace(".0", "")

                new_values = []
                # Iterate over the values and remove ".0"
                for value in values:
                    new_value = str(value).replace(".0", "")
                    new_values.append(new_value)

                new_dict[new_transaction_id] = new_values

            sorted_supi_dict[supi] = new_dict

# --------------------------------------------- Execution starts from here --------------------------------------------- #

if __name__ == "__main__":

    selected_filter = sys.argv[1]
    filter_value = sys.argv[2]
    file_path = sys.argv[3]

    print("Selected filter:", selected_filter)
    print("Filter value:", filter_value)
    print("File path:", file_path)

    try:
        print("try block")
        df = pd.read_csv(file_path, header=None)
        row_len = len(df)
        approx_time = (row_len/1000)
        print(f"This file will take approximately {approx_time} minutes to process")
    except:
        print("except block")
        max_cols = 0
        with open(file_path, 'r') as f:
            for line in f:
                num_cols = len(line.split(','))
                if num_cols > max_cols:
                    max_cols = num_cols
        header_list = [i for i in range(max_cols)]
        df = pd.read_csv(file_path, header=None, names=header_list)
        row_len = len(df)
        approx_time = (row_len/1000)
        print(f"This file will take approximately {approx_time} minutes to process")

    file_name = file_path.split("\\")[-1]

    print(file_name)

    if selected_filter == 'Supi':
        supi_fetch(df, filter_value, file_name)

    elif selected_filter == 'Date':
        date_fetch(df, file_name, filter_value, filter_value)

    elif selected_filter == 'DisconnectCause':
        disconnet_cause_fetch(df, file_name, filter_value)

    else:
        process_file(df, file_path)

    print("Data fetch Successful! Have a look in the Results page")

    # ------------------------------------ File data --------------------------------------

    file_data = json.dumps(info_dict, default=str, indent=4)

    with open("file_data.json", "w") as json_file:
        json_file.write(file_data)

    # -------------------------------- Disconnect Reason ----------------------------------

    disconnet_reason_data = json.dumps(disconnect_reason_dict, default=str, indent=4)

    with open("disconnet_reason_data.json", "w") as json_file:
        json_file.write(disconnet_reason_data)

    # ------------------------------------- Rat type --------------------------------------

    rat_type_data = json.dumps(rat_type_dict, default=str, indent=4)

    with open("rat_type_data.json", "w") as json_file:
        json_file.write(rat_type_data)

    # -------------------------------------- snssai  --------------------------------------

    snssai_type_data = json.dumps(snssai_dict, default=str, indent=4)

    with open("snssai_type_data.json", "w") as json_file:
        json_file.write(snssai_type_data)

    # ------------------------------------- Dnn type --------------------------------------

    dnn_type_data = json.dumps(dnn_dict, default=str, indent=4)

    with open("dnn_type_data.json", "w") as json_file:
        json_file.write(dnn_type_data)

    # with open("data.json", 'w') as data_file:
    #     json.dump(info_dict, data_file)
