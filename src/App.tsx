
import { useHashConnectContext } from '../src/contexts/hashconnect'
import { useState } from 'react';
import ParingModal from '../src/components/paring';
import AuthenticationModal from '../src/components/authentication';
import SignModal from '../src/components/sign';
import SendTransactionModal from '../src/components/sendTransaction';
import PrngModal from '../src/components/prngTransaction';
import AccountUpdateModal from '../src/components/accountUpdate';
import AssociateTokenModal from '../src/components/associateToken';
import DisassociateTokenModal from '../src/components/disassociateToken';
import AllowanceApproveModal from '../src/components/allowanceApprove';
import AllowanceDeleteModal from '../src/components/allowanceDelete';
import CreateTokenModal from '../src/components/createToken';
import DeleteTokenModal from '../src/components/deleteToken';
import MintTokenModal from '../src/components/mintToken';
import BurnTokenModal from '../src/components/burnToken';
import PauseTokenModal from '../src/components/pauseToken';
import UnpauseTokenModal from '../src/components/unpauseToken';
import WipeTokenModal from '../src/components/wipeToken';
import TokenKycGrantModal from '../src/components/tokeKycGrant';
import TokenKycRevokeModal from '../src/components/tokeKycRevoke';
import TokenFreezeAccountModal from '../src/components/tokenFreezeAccount';
import TokenUnfreezeAccountModal from '../src/components/tokenUnfreezeAccount';
import TokenFeeUpdateModal from '../src/components/tokenFeeUpdate';
import FileCreateModal from '../src/components/fileCreate';
import FileAppendModal from '../src/components/fileAppend';
import SmartContractCreateModal from '../src/components/smartContractCreate';
import SmartContractDeleteModal from '../src/components/smartContractDelete';
import SmartContractCallModal from '../src/components/smartContractCall';
import SmartContractExecuteModal from '../src/components/smartContractExecute';
import HcsCreateTopicModal from '../src/components/hcsCreateTopic';
import HcsDeleteTopicModal from '../src/components/hcsDeleteTopic';
import HcsUpdateTopicModal from '../src/components/hcsUpdateTopic';
import HcsSubmitMessageModal from '../src/components/hcsSubmitMessage';
import Announcement from '../src/components/general/announcement';


export default function App() {
  const { state, pairingData, hcData, clearPairings, disconnect } = useHashConnectContext();
  const [viewData, setViewData] = useState(false);
  const [loadModals, setLoadModals] = useState({
    loadPairModal: false,
    loadAuthenticationModal: false,
    loadSignModal: false,
    loadSendTransactionModal: false,
    loadPrngModal: false,
    loadAccountUpdateModal: false,
    loadAssociateTokenModal: false,
    loadDisassociateTokenModal: false,
    loadAllowanceApproveModal: false,
    loadAllowanceDeleteModal: false,
    loadCreateTokenModal: false,
    loadDeleteTokenModal: false,
    loadMintTokenModal: false,
    loadBurnTokenModal: false,
    loadPauseTokenModal: false,
    loadUnpauseTokenModal: false,
    loadWipeTokenModal: false,
    loadTokenKycGrantModal: false,
    loadTokenKycRevokeModal: false,
    loadTokenFreezeAccountModal: false,
    loadTokenUnfreezeAccountModal: false,
    loadTokenFeeUpdateModal: false,
    loadFileCreateModal: false,
    loadFileAppendModal: false,
    loadSmartContractCreateModal: false,
    loadSmartContractDeleteModal: false,
    loadSmartContractCallModal: false,
    loadSmartContractExecuteModal: false,
    loadHcsCreateTopicModal: false,
    loadHcsDeleteTopicModal: false,
    loadHcsUpdateTopicModal: false,
    loadHcsSubmitMessageModal: false,
  })

  const setLoadModal = (modalName: string, value: boolean) => {
    setLoadModals({ ...loadModals, [modalName]: value });
  }

  return (
    <article >
      <header className='text-center pt-8'>
        <h1 className='text-3xl font-bold'>dapp | proposer</h1>
        <h2 className='text-2xl font-bold'>Status: {state}</h2>

        <h3>Connected accounts: {JSON.stringify(pairingData?.accountIds)}</h3>
      </header>

      <section className="flex justify-center items-start">
        <main className='w-80 p-2'>
          <div className='text-center py-2'>
            <input type="checkbox" id="viewData" className='mr-2' checked={viewData} onChange={(event: any) => setViewData(event.target.checked)} />
            <label htmlFor='viewData'>View HashConnect Data</label>
          </div>
          <button onClick={() => setLoadModal("loadPairModal", true)} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 mb-1 border-b-4 border-indigo-800 hover:border-indigo-1000 rounded disabled:opacity-50"
            disabled={state === 'Paired' || state === 'Disconnected'}>Pair</button>
          <button onClick={() => clearPairings()} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2 px-4 mb-1 border-b-4 border-indigo-800 hover:border-indigo-1000 rounded disabled:opacity-50"
          >Clear HashConnect Data - will need to refresh</button>
          <button onClick={() => disconnect()} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 mb-1 border-b-4 border-indigo-800 hover:border-indigo-1000 rounded disabled:opacity-50"
            disabled={state !== 'Paired'}>Disconnect</button>
          <button onClick={() => setLoadModal("loadAuthenticationModal", true)} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 mb-1 border-b-4 border-indigo-800 hover:border-indigo-1000 rounded disabled:opacity-50"
            disabled={state !== 'Paired'}>Authenticate</button>
          <button onClick={() => setLoadModal("loadSignModal", true)} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 mb-1 border-b-4 border-indigo-800 hover:border-indigo-1000 rounded disabled:opacity-50"
            disabled={state !== 'Paired'}>Sign</button>
          <button onClick={() => setLoadModal("loadSendTransactionModal", true)} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 mb-1 border-b-4 border-indigo-800 hover:border-indigo-1000 rounded disabled:opacity-50"
            disabled={state !== 'Paired'}>Create basic transaction</button>
          <button onClick={() => setLoadModal("loadPrngModal", true)} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 mb-1 border-b-4 border-indigo-800 hover:border-indigo-1000 rounded disabled:opacity-50"
            disabled={state !== 'Paired'}>prng</button>

          <h3 className='pt-3 pb-2 text-center'>Accounts</h3>
          <button onClick={() => setLoadModal("loadAccountUpdateModal", true)} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 mb-1 border-b-4 border-indigo-800 hover:border-indigo-1000 rounded  disabled:opacity-50"
            disabled={state !== 'Paired'}>Account Update</button>
          <button onClick={() => setLoadModal("loadAssociateTokenModal", true)} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 mb-1 border-b-4 border-indigo-800 hover:border-indigo-1000 rounded  disabled:opacity-50"
            disabled={state !== 'Paired'}>Associate Token</button>
          <button onClick={() => setLoadModal("loadDisassociateTokenModal", true)} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 mb-1 border-b-4 border-indigo-800 hover:border-indigo-1000 rounded  disabled:opacity-50"
            disabled={state !== 'Paired'}>Disassociate Token</button>
          <button onClick={() => setLoadModal("loadAllowanceApproveModal", true)} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 mb-1 border-b-4 border-indigo-800 hover:border-indigo-1000 rounded  disabled:opacity-50"
            disabled={state !== 'Paired'}>Allowance Approve</button>
          <button onClick={() => setLoadModal("loadAllowanceDeleteModal", true)} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 mb-1 border-b-4 border-indigo-800 hover:border-indigo-1000 rounded  disabled:opacity-50"
            disabled={state !== 'Paired'}>Allowance Delete</button>

          <h3 className='pt-3 pb-2 text-center'>Tokens</h3>
          <button onClick={() => setLoadModal("loadCreateTokenModal", true)} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 mb-1 border-b-4 border-indigo-800 hover:border-indigo-1000 rounded  disabled:opacity-50"
            disabled={state !== 'Paired'}>Create Token</button>
          <button onClick={() => setLoadModal("loadDeleteTokenModal", true)} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 mb-1 border-b-4 border-indigo-800 hover:border-indigo-1000 rounded  disabled:opacity-50"
            disabled={state !== 'Paired'}>Delete Token</button>
          <button onClick={() => setLoadModal("loadMintTokenModal", true)} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 mb-1 border-b-4 border-indigo-800 hover:border-indigo-1000 rounded  disabled:opacity-50"
            disabled={state !== 'Paired'}>Mint Token</button>
          <button onClick={() => setLoadModal("loadBurnTokenModal", true)} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 mb-1 border-b-4 border-indigo-800 hover:border-indigo-1000 rounded  disabled:opacity-50"
            disabled={state !== 'Paired'}>Burn Token</button>
          <button onClick={() => setLoadModal("loadPauseTokenModal", true)} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 mb-1 border-b-4 border-indigo-800 hover:border-indigo-1000 rounded  disabled:opacity-50"
            disabled={state !== 'Paired'}>Pause Token</button>
          <button onClick={() => setLoadModal("loadUnpauseTokenModal", true)} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 mb-1 border-b-4 border-indigo-800 hover:border-indigo-1000 rounded  disabled:opacity-50"
            disabled={state !== 'Paired'}>Unpause Token</button>
          <button onClick={() => setLoadModal("loadWipeTokenModal", true)} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 mb-1 border-b-4 border-indigo-800 hover:border-indigo-1000 rounded  disabled:opacity-50"
            disabled={state !== 'Paired'}>Wipe Token</button>

          <button onClick={() => setLoadModal("loadTokenKycGrantModal", true)} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 mb-1 border-b-4 border-indigo-800 hover:border-indigo-1000 rounded  disabled:opacity-50"
            disabled={state !== 'Paired'}>Grant Token KYC</button>
          <button onClick={() => setLoadModal("loadTokenKycRevokeModal", true)} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 mb-1 border-b-4 border-indigo-800 hover:border-indigo-1000 rounded  disabled:opacity-50"
            disabled={state !== 'Paired'}>Revoke Token KYC</button>

          <button onClick={() => setLoadModal("loadTokenFreezeAccountModal", true)} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 mb-1 border-b-4 border-indigo-800 hover:border-indigo-1000 rounded  disabled:opacity-50"
            disabled={state !== 'Paired'}>Freeze Token</button>
          <button onClick={() => setLoadModal("loadTokenUnfreezeAccountModal", true)} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 mb-1 border-b-4 border-indigo-800 hover:border-indigo-1000 rounded  disabled:opacity-50"
            disabled={state !== 'Paired'}>Unfreeze Token</button>

          <button onClick={() => setLoadModal("loadTokenFeeUpdateModal", true)} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 mb-1 border-b-4 border-indigo-800 hover:border-indigo-1000 rounded  disabled:opacity-50"
            disabled={state !== 'Paired'}>Token Fee Update</button>

          <h3 className='pt-3 pb-2 text-center'>File Service</h3>
          <button onClick={() => setLoadModal("loadFileCreateModal", true)} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 mb-1 border-b-4 border-indigo-800 hover:border-indigo-1000 rounded  disabled:opacity-50"
            disabled={state !== 'Paired'}>File Create</button>
          <button onClick={() => setLoadModal("loadFileAppendModal", true)} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 mb-1 border-b-4 border-indigo-800 hover:border-indigo-1000 rounded  disabled:opacity-50"
            disabled={state !== 'Paired'}>File Append</button>

          <h3 className='pt-3 pb-2 text-center'>Smart Contracts</h3>
          <button onClick={() => setLoadModal("loadSmartContractCreateModal", true)} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 mb-1 border-b-4 border-indigo-800 hover:border-indigo-1000 rounded  disabled:opacity-50"
            disabled={state !== 'Paired'}>Smart Contract Create</button>
          <button onClick={() => setLoadModal("loadSmartContractDeleteModal", true)} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 mb-1 border-b-4 border-indigo-800 hover:border-indigo-1000 rounded  disabled:opacity-50"
            disabled={state !== 'Paired'}>Smart Contract Delete</button>
          <button onClick={() => setLoadModal("loadSmartContractCallModal", true)} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 mb-1 border-b-4 border-indigo-800 hover:border-indigo-1000 rounded  disabled:opacity-50"
            disabled={state !== 'Paired'}>Smart Contract Call</button>
          <button onClick={() => setLoadModal("loadSmartContractExecuteModal", true)} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 mb-1 border-b-4 border-indigo-800 hover:border-indigo-1000 rounded  disabled:opacity-50"
            disabled={state !== 'Paired'}>Execute</button>

          <h3 className='pt-3 pb-2 text-center'>Consensus Service</h3>
          <button onClick={() => setLoadModal("loadHcsCreateTopicModal", true)} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 mb-1 border-b-4 border-indigo-800 hover:border-indigo-1000 rounded  disabled:opacity-50"
            disabled={state !== 'Paired'}>Create Topic</button>
          <button onClick={() => setLoadModal("loadHcsDeleteTopicModal", true)} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 mb-1 border-b-4 border-indigo-800 hover:border-indigo-1000 rounded  disabled:opacity-50"
            disabled={state !== 'Paired'}>Delete Topic</button>
          <button onClick={() => setLoadModal("loadHcsUpdateTopicModal", true)} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 mb-1 border-b-4 border-indigo-800 hover:border-indigo-1000 rounded  disabled:opacity-50"
            disabled={state !== 'Paired'}>Update Topic</button>
          <button onClick={() => setLoadModal("loadHcsSubmitMessageModal", true)} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 mb-1 border-b-4 border-indigo-800 hover:border-indigo-1000 rounded  disabled:opacity-50"
            disabled={state !== 'Paired'}>Submit Message</button>
        </main>
        {viewData && <aside className='w-80 md:w-1/2 p-2 overflow-x-auto'>
          <pre>{JSON.stringify(hcData, null, 2)}</pre>
        </aside>}
      </section>
      <Announcement />
      {loadModals.loadPairModal && <ParingModal setLoadModal={(value: boolean) => setLoadModal("loadPairModal", value)}></ParingModal>}
      {loadModals.loadAuthenticationModal && <AuthenticationModal setLoadModal={(value: boolean) => setLoadModal("loadAuthenticationModal", value)}></AuthenticationModal>}
      {loadModals.loadSignModal && <SignModal setLoadModal={(value: boolean) => setLoadModal("loadSignModal", value)}></SignModal>}
      {loadModals.loadSendTransactionModal && <SendTransactionModal setLoadModal={(value: boolean) => setLoadModal("loadSendTransactionModal", value)}></SendTransactionModal>}
      {loadModals.loadPrngModal && <PrngModal setLoadModal={(value: boolean) => setLoadModal("loadPrngModal", value)}></PrngModal>}
      {loadModals.loadAccountUpdateModal && <AccountUpdateModal setLoadModal={(value: boolean) => setLoadModal("loadAccountUpdateModal", value)}></AccountUpdateModal>}
      {loadModals.loadAssociateTokenModal && <AssociateTokenModal setLoadModal={(value: boolean) => setLoadModal("loadAssociateTokenModal", value)}></AssociateTokenModal>}
      {loadModals.loadDisassociateTokenModal && <DisassociateTokenModal setLoadModal={(value: boolean) => setLoadModal("loadDisassociateTokenModal", value)}></DisassociateTokenModal>}
      {loadModals.loadAllowanceApproveModal && <AllowanceApproveModal setLoadModal={(value: boolean) => setLoadModal("loadAllowanceApproveModal", value)}></AllowanceApproveModal>}
      {loadModals.loadAllowanceDeleteModal && <AllowanceDeleteModal setLoadModal={(value: boolean) => setLoadModal("loadAllowanceDeleteModal", value)}></AllowanceDeleteModal>}
      {loadModals.loadCreateTokenModal && <CreateTokenModal setLoadModal={(value: boolean) => setLoadModal("loadCreateTokenModal", value)}></CreateTokenModal>}
      {loadModals.loadDeleteTokenModal && <DeleteTokenModal setLoadModal={(value: boolean) => setLoadModal("loadDeleteTokenModal", value)}></DeleteTokenModal>}
      {loadModals.loadMintTokenModal && <MintTokenModal setLoadModal={(value: boolean) => setLoadModal("loadMintTokenModal", value)}></MintTokenModal>}
      {loadModals.loadBurnTokenModal && <BurnTokenModal setLoadModal={(value: boolean) => setLoadModal("loadBurnTokenModal", value)}></BurnTokenModal>}
      {loadModals.loadPauseTokenModal && <PauseTokenModal setLoadModal={(value: boolean) => setLoadModal("loadPauseTokenModal", value)}></PauseTokenModal>}
      {loadModals.loadUnpauseTokenModal && <UnpauseTokenModal setLoadModal={(value: boolean) => setLoadModal("loadUnpauseTokenModal", value)}></UnpauseTokenModal>}
      {loadModals.loadWipeTokenModal && <WipeTokenModal setLoadModal={(value: boolean) => setLoadModal("loadWipeTokenModal", value)}></WipeTokenModal>}
      {loadModals.loadTokenKycGrantModal && <TokenKycGrantModal setLoadModal={(value: boolean) => setLoadModal("loadTokenKycGrantModal", value)}></TokenKycGrantModal>}
      {loadModals.loadTokenKycRevokeModal && <TokenKycRevokeModal setLoadModal={(value: boolean) => setLoadModal("loadTokenKycRevokeModal", value)}></TokenKycRevokeModal>}
      {loadModals.loadTokenFreezeAccountModal && <TokenFreezeAccountModal setLoadModal={(value: boolean) => setLoadModal("loadTokenFreezeAccountModal", value)}></TokenFreezeAccountModal>}
      {loadModals.loadTokenUnfreezeAccountModal && <TokenUnfreezeAccountModal setLoadModal={(value: boolean) => setLoadModal("loadTokenUnfreezeAccountModal", value)}></TokenUnfreezeAccountModal>}
      {loadModals.loadTokenFeeUpdateModal && <TokenFeeUpdateModal setLoadModal={(value: boolean) => setLoadModal("loadTokenFeeUpdateModal", value)}></TokenFeeUpdateModal>}
      {loadModals.loadFileCreateModal && <FileCreateModal setLoadModal={(value: boolean) => setLoadModal("loadFileCreateModal", value)}></FileCreateModal>}
      {loadModals.loadFileAppendModal && <FileAppendModal setLoadModal={(value: boolean) => setLoadModal("loadFileAppendModal", value)}></FileAppendModal>}
      {loadModals.loadSmartContractCreateModal && <SmartContractCreateModal setLoadModal={(value: boolean) => setLoadModal("loadSmartContractCreateModal", value)}></SmartContractCreateModal>}
      {loadModals.loadSmartContractDeleteModal && <SmartContractDeleteModal setLoadModal={(value: boolean) => setLoadModal("loadSmartContractDeleteModal", value)}></SmartContractDeleteModal>}
      {loadModals.loadSmartContractCallModal && <SmartContractCallModal setLoadModal={(value: boolean) => setLoadModal("loadSmartContractCallModal", value)}></SmartContractCallModal>}
      {loadModals.loadSmartContractExecuteModal && <SmartContractExecuteModal setLoadModal={(value: boolean) => setLoadModal("loadSmartContractExecuteModal", value)}></SmartContractExecuteModal>}
      {loadModals.loadHcsCreateTopicModal && <HcsCreateTopicModal setLoadModal={(value: boolean) => setLoadModal("loadHcsCreateTopicModal", value)}></HcsCreateTopicModal>}
      {loadModals.loadHcsDeleteTopicModal && <HcsDeleteTopicModal setLoadModal={(value: boolean) => setLoadModal("loadHcsDeleteTopicModal", value)}></HcsDeleteTopicModal>}
      {loadModals.loadHcsUpdateTopicModal && <HcsUpdateTopicModal setLoadModal={(value: boolean) => setLoadModal("loadHcsUpdateTopicModal", value)}></HcsUpdateTopicModal>}
      {loadModals.loadHcsSubmitMessageModal && <HcsSubmitMessageModal setLoadModal={(value: boolean) => setLoadModal("loadHcsSubmitMessageModal", value)}></HcsSubmitMessageModal>}
    </article >
  )
}