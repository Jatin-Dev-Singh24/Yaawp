import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Send,
  Image as ImageIcon,
  Heart,
  Phone,
  Video,
  Info,
  Search,
  SquarePen,
  ChevronLeft,
  X,
  Check,
  CheckCheck,
  Clock,
  Mic,
  Square,
  Trash2,
  CornerUpLeft,
  Film,
  FileText,
  Lock,
  Sparkles,
  MoreVertical,
  Eye,
  EyeOff,
  Key,
  Users,
  Globe,
  Unlock,
  Shield,
  Plus
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ChatMessage } from '../types';
import { VoiceNotePlayer } from './VoiceNotePlayer';
import { ChatPasscodeLock } from './ChatPasscodeLock';
import { MediaAttachmentModal } from './MediaAttachmentModal';

export const MessagesView: React.FC = () => {
  const {
    conversations,
    currentUser,
    sendMessage,
    sendVoiceMessage,
    sendMediaMessage,
    triggerTypingIndicator,
    markConversationAsRead,
    showToast,
    activeConvId,
    setActiveConvId,
    allUsers,
    startConversationWithUser,
    openUserProfile,
    isChatLocked,
    chatPasscode,
    setIsChatLocked,
    toggleHideChat,
    chatSecretCode,
    setChatSecretCode,
    createGroupChat,
    stories,
    setActiveStoryUserIndex,
    setActiveTab
  } = useApp();

  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [showMediaModal, setShowMediaModal] = useState(false);
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [mobileShowChat, setMobileShowChat] = useState(false);
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);

  // Hidden chats & secret code management
  const [showSecretCodeModal, setShowSecretCodeModal] = useState(false);
  const [newSecretCodeInput, setNewSecretCodeInput] = useState(chatSecretCode || '1234');
  const [openConvMenuId, setOpenConvMenuId] = useState<string | null>(null);
  const [chatHeaderMenuOpen, setChatHeaderMenuOpen] = useState(false);

  // Group chat creation state
  const [newChatTab, setNewChatTab] = useState<'direct' | 'group'>('direct');
  const [groupName, setGroupName] = useState('');
  const [groupIsPublic, setGroupIsPublic] = useState(false);
  const [selectedGroupMembers, setSelectedGroupMembers] = useState<string[]>([]);

  // Quote / Reply state
  const [replyingTo, setReplyingTo] = useState<{ id: string; text: string; senderName: string } | null>(null);

  // In-composer Voice Recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const recordTimerRef = useRef<number | null>(null);

  // Long press detection for mobile
  const longPressTimerRef = useRef<number | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Set default active conversation if none selected
  const activeConversation = conversations.find(c => c.id === activeConvId) || conversations[0];

  // Auto scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConversation?.messages, activeConversation?.isTyping]);

  // Mark conversation as read when opened
  useEffect(() => {
    if (activeConversation && activeConversation.unreadCount > 0) {
      markConversationAsRead(activeConversation.id);
    }
  }, [activeConversation?.id, activeConversation?.unreadCount]);

  // Voice recording timer
  useEffect(() => {
    if (isRecording) {
      setRecordingSeconds(0);
      recordTimerRef.current = window.setInterval(() => {
        setRecordingSeconds(prev => prev + 1);
      }, 1000);
    } else {
      if (recordTimerRef.current) {
        clearInterval(recordTimerRef.current);
      }
    }
    return () => {
      if (recordTimerRef.current) {
        clearInterval(recordTimerRef.current);
      }
    };
  }, [isRecording]);

  // If chat is protected by passcode and locked, render the passcode lock screen
  if (isChatLocked && chatPasscode) {
    return (
      <div className="flex-1 flex flex-col h-[calc(100vh-4rem)] bg-slate-50 dark:bg-slate-950">
        <ChatPasscodeLock />
      </div>
    );
  }

  const handleSelectConversation = (id: string) => {
    setActiveConvId(id);
    setMobileShowChat(true);
    markConversationAsRead(id);
  };

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || !activeConversation) return;

    sendMessage(activeConversation.id, inputText.trim(), {
      replyTo: replyingTo || undefined
    });

    setInputText('');
    setReplyingTo(null);
  };

  const handleSendHeart = () => {
    if (!activeConversation) return;
    sendMessage(activeConversation.id, '❤️', {
      replyTo: replyingTo || undefined
    });
    setReplyingTo(null);
  };

  // Voice Recording handlers
  const handleStartRecording = () => {
    setIsRecording(true);
    showToast('Recording voice note... speak now');
  };

  const handleCancelRecording = () => {
    setIsRecording(false);
    setRecordingSeconds(0);
    showToast('Voice note discarded');
  };

  const handleFinishAndSendVoice = () => {
    if (!activeConversation) return;
    const duration = Math.max(1, recordingSeconds);
    sendVoiceMessage(activeConversation.id, duration, replyingTo || undefined);
    setIsRecording(false);
    setRecordingSeconds(0);
    setReplyingTo(null);
    showToast(`Voice note (${duration}s) sent!`);
  };

  // Media Attachment handler
  const handleSendMedia = (mediaUrl: string, mediaType: 'image' | 'video' | 'file', caption: string, fileName?: string) => {
    if (!activeConversation) return;
    sendMediaMessage(activeConversation.id, mediaUrl, mediaType, caption, fileName, replyingTo || undefined);
    setReplyingTo(null);
  };

  // Simulate instant typing indicator & auto response
  const handleSimulateTyping = () => {
    if (!activeConversation) return;
    triggerTypingIndicator(activeConversation.id, true);
    showToast(`${activeConversation.participant.name} is typing...`);

    setTimeout(() => {
      triggerTypingIndicator(activeConversation.id, false);
      const responses = [
        "Hey! The lighting in that new visual collective is unreal 🔥",
        "Listening to that voice note now, sounds crisp!",
        "Just checked out your updated portfolio. Loving the direction!",
        "Let's catch up on the upcoming film project this week ✨"
      ];
      const randomMsg = responses[Math.floor(Math.random() * responses.length)];
      sendMessage(activeConversation.id, randomMsg);
    }, 2400);
  };

  const handleStartNewChat = (user: { id: string; username: string; name: string; avatar: string }) => {
    startConversationWithUser(user);
    setShowNewChatModal(false);
    setUserSearchQuery('');
    setMobileShowChat(true);
  };

  // Long press handler for replying on touch/mouse
  const handleTouchStart = (msg: ChatMessage, senderName: string) => {
    longPressTimerRef.current = window.setTimeout(() => {
      setReplyingTo({
        id: msg.id,
        text: msg.isVoice ? '🎙️ Voice note' : msg.mediaUrl ? '📷 Media' : msg.text,
        senderName
      });
      showToast(`Replying to ${senderName}`);
      inputRef.current?.focus();
    }, 550);
  };

  const handleTouchEnd = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
    }
  };

  // Filter existing conversations based on Secret Code entry:
  // Typing the secret code in search reveals the WhatsApp-style Locked Chats column!
  const isSecretUnlocked = Boolean(chatSecretCode && searchQuery.trim() === chatSecretCode);

  const filteredConversations = conversations.filter(c => {
    if (isSecretUnlocked) {
      return c.isHiddenChat;
    }
    if (c.isHiddenChat) {
      return false;
    }
    return (
      c.participant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.participant.username.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  // Stories for hidden contacts (shown strictly in the locked column)
  const hiddenUserIds = new Set(conversations.filter(c => c.isHiddenChat).map(c => c.participant.id));
  const hiddenContactsStories = stories.filter(s => hiddenUserIds.has(s.user.id));

  // Search across all community users for initiating a new chat
  const searchableUsers = allUsers.filter(u =>
    u.id !== currentUser.id &&
    (u.username.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
     u.name.toLowerCase().includes(userSearchQuery.toLowerCase()))
  );

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="flex-1 flex h-[calc(100vh-4rem)] max-w-6xl mx-auto w-full border-x border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden select-none">
      {/* Conversations Sidebar */}
      <div
        className={`w-full md:w-80 lg:w-96 border-r border-slate-200 dark:border-slate-800 flex flex-col bg-white dark:bg-slate-900 shrink-0 ${
          mobileShowChat ? 'hidden md:flex' : 'flex'
        }`}
      >
        {/* Header with Lock Toggle & New Chat */}
        <div className="p-3.5 px-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">Direct Messages</h2>
            {chatPasscode && (
              <button
                type="button"
                onClick={() => {
                  setIsChatLocked(true);
                  showToast('Direct Messages locked');
                }}
                className="p-1 rounded-md text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Lock Messages with PIN"
              >
                <Lock className="w-3.5 h-3.5" />
              </button>
            )}
            {/* Secret code config button */}
            <button
              type="button"
              onClick={() => setShowSecretCodeModal(true)}
              className="p-1 rounded-md text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Configure Secret Code for Hidden Chats"
            >
              <Key className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="flex items-center gap-1">
            <button
              id="messages-communities-btn"
              onClick={() => setActiveTab('communities')}
              className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Communities & Channels"
              aria-label="Communities"
            >
              <Users className="w-5 h-5" />
            </button>
            <button
              id="new-chat-btn"
              onClick={() => setShowNewChatModal(true)}
              className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Compose message or create group"
            >
              <SquarePen className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="p-3 border-b border-slate-100 dark:border-slate-800/80">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search chats or enter secret code..."
              className="w-full pl-9 pr-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-400 focus:bg-white dark:focus:bg-slate-800"
            />
          </div>
        </div>

        {/* Secret Unlocked Banner & Hidden Stories Tray */}
        {isSecretUnlocked && (
          <div className="bg-indigo-50 dark:bg-indigo-950/40 border-b border-indigo-200 dark:border-indigo-800/50 p-3 px-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Unlock className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <div>
                  <h3 className="text-xs font-bold text-indigo-600 dark:text-indigo-400">Locked Chats Column</h3>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">Hidden chats & stories unlocked</p>
                </div>
              </div>
              <button
                onClick={() => setSearchQuery('')}
                className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white px-2 py-1 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                Exit
              </button>
            </div>

            {/* Hidden Stories carousel */}
            {hiddenContactsStories.length > 0 ? (
              <div className="mt-2 pt-2 border-t border-indigo-200 dark:border-indigo-800/40">
                <p className="text-[10px] font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
                  <span>Hidden Contacts Stories</span>
                </p>
                <div className="flex items-center gap-3 overflow-x-auto py-1">
                  {hiddenContactsStories.map(st => {
                    const sIndex = stories.findIndex(s => s.id === st.id);
                    return (
                      <div
                        key={st.id}
                        onClick={() => setActiveStoryUserIndex(sIndex !== -1 ? sIndex : 0)}
                        className="flex flex-col items-center gap-1 shrink-0 cursor-pointer group"
                      >
                        <div className="w-10 h-10 rounded-full p-[2px] ring-2 ring-indigo-500">
                          <img
                            src={st.user.avatar}
                            alt={st.user.username}
                            className="w-full h-full rounded-full object-cover"
                          />
                        </div>
                        <span className="text-[9px] text-slate-600 dark:text-slate-400 truncate max-w-[50px]">
                          @{st.user.username}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <p className="text-[10px] text-slate-500 italic mt-1">
                No active stories from hidden contacts right now.
              </p>
            )}
          </div>
        )}

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
          {filteredConversations.length > 0 ? (
            filteredConversations.map(conv => {
              const isActive = conv.id === activeConversation?.id;
              const isMenuOpen = openConvMenuId === conv.id;

              return (
                <div
                  key={conv.id}
                  id={`conv-item-${conv.id}`}
                  onClick={() => handleSelectConversation(conv.id)}
                  className={`p-3 px-4 flex items-center gap-3 cursor-pointer transition-colors relative group ${
                    isActive
                      ? 'bg-indigo-50/80 dark:bg-indigo-950/30 border-l-4 border-indigo-600 dark:border-indigo-500'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <div className="relative">
                    <img
                      src={conv.participant.avatar}
                      alt={conv.participant.username}
                      className="w-12 h-12 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                    />
                    {conv.participant.isOnline && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
                    )}
                    {conv.isGroup && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[9px] font-bold ring-2 ring-white dark:ring-slate-900" title="Group Chat">
                        <Users className="w-2.5 h-2.5" />
                      </span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold text-slate-900 dark:text-white truncate flex items-center gap-1">
                        {conv.participant.name}
                        {conv.isGroup && (
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-normal">
                            ({conv.isPublic ? 'Public' : 'Private'})
                          </span>
                        )}
                      </p>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500">
                        {conv.lastMessageTime}
                      </span>
                    </div>

                    <div className="flex items-center justify-between mt-1">
                      <p className={`text-xs truncate ${conv.unreadCount > 0 ? 'font-semibold text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}>
                        {conv.isTyping ? (
                          <span className="text-indigo-600 dark:text-indigo-400 font-medium flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400 animate-pulse" />
                            typing...
                          </span>
                        ) : (
                          conv.lastMessage
                        )}
                      </p>

                      <div className="flex items-center gap-1.5 shrink-0 ml-2">
                        {conv.unreadCount > 0 && (
                          <span className="w-4 h-4 rounded-full bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center">
                            {conv.unreadCount}
                          </span>
                        )}

                        {/* 3-dot action button on hover */}
                        <div className="relative" onClick={e => e.stopPropagation()}>
                          <button
                            type="button"
                            onClick={() => setOpenConvMenuId(isMenuOpen ? null : conv.id)}
                            className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Chat options"
                          >
                            <MoreVertical className="w-3.5 h-3.5" />
                          </button>

                          {isMenuOpen && (
                            <div className="absolute right-0 top-6 z-30 w-36 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl py-1 text-xs text-slate-700 dark:text-slate-200">
                              <button
                                onClick={() => {
                                  toggleHideChat(conv.id);
                                  setOpenConvMenuId(null);
                                }}
                                className="w-full px-3 py-1.5 text-left hover:bg-slate-100 dark:hover:bg-slate-750 flex items-center gap-2"
                              >
                                {conv.isHiddenChat ? (
                                  <>
                                    <Eye className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                                    <span>Unhide Chat</span>
                                  </>
                                ) : (
                                  <>
                                    <EyeOff className="w-3.5 h-3.5 text-amber-500" />
                                    <span>Hide Chat</span>
                                  </>
                                )}
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center text-xs text-slate-500 dark:text-slate-400 space-y-1">
              <p>{isSecretUnlocked ? 'No locked chats currently hidden' : 'No conversations found'}</p>
              {!isSecretUnlocked && (
                <p className="text-[11px] text-slate-400 dark:text-slate-500">
                  Tip: Type your secret code to reveal locked chats
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Main Chat Pane */}
      {activeConversation ? (
        <div
          className={`flex-1 flex flex-col bg-slate-50/60 dark:bg-slate-950 min-w-0 ${
            mobileShowChat ? 'flex' : 'hidden md:flex'
          }`}
        >
          {/* Top Bar with Participant Info & Actions */}
          <div className="p-3 px-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white/95 dark:bg-slate-900/95 backdrop-blur-xs z-10">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileShowChat(false)}
                className="md:hidden p-1 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                title="Back to conversations"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div
                onClick={() => openUserProfile(activeConversation.participant.id)}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <div className="relative">
                  <img
                    src={activeConversation.participant.avatar}
                    alt={activeConversation.participant.username}
                    className="w-9 h-9 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700 group-hover:ring-indigo-500 transition-colors"
                  />
                  {activeConversation.participant.isOnline && (
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
                  )}
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors flex items-center gap-1.5">
                    {activeConversation.participant.name}
                  </h3>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">
                    {activeConversation.isTyping ? (
                      <span className="text-indigo-600 dark:text-indigo-400 font-medium">typing...</span>
                    ) : activeConversation.participant.isOnline ? (
                      'Active now'
                    ) : (
                      `@${activeConversation.participant.username}`
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Actions & Demo Triggers */}
            <div className="flex items-center gap-1.5">
              {/* Simulate typing dots button */}
              <button
                type="button"
                onClick={handleSimulateTyping}
                className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-500 text-[11px] text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all shadow-xs"
                title="Simulate typing dots from contact"
              >
                <Sparkles className="w-3 h-3 text-indigo-500" />
                <span>Simulate Reply</span>
              </button>

              <button
                onClick={() => showToast('Simulating secure audio call...')}
                className="p-2 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                title="Audio Call"
              >
                <Phone className="w-4 h-4" />
              </button>
              <button
                onClick={() => showToast('Simulating encrypted video call...')}
                className="p-2 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                title="Video Call"
              >
                <Video className="w-4 h-4" />
              </button>
              <button
                onClick={() => openUserProfile(activeConversation.participant.id)}
                className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                title="View Profile Details"
              >
                <Info className="w-4 h-4" />
              </button>

              {/* Chat Header 3-dot dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setChatHeaderMenuOpen(!chatHeaderMenuOpen)}
                  className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                  title="More actions"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>

                {chatHeaderMenuOpen && (
                  <div className="absolute right-0 top-10 z-30 w-48 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl py-1 text-xs text-slate-700 dark:text-slate-200">
                    <button
                      onClick={() => {
                        toggleHideChat(activeConversation.id);
                        setChatHeaderMenuOpen(false);
                      }}
                      className="w-full px-3.5 py-2 text-left hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2"
                    >
                      {activeConversation.isHiddenChat ? (
                        <>
                          <Eye className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                          <span>Unhide this chat</span>
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-4 h-4 text-amber-500" />
                          <span>Hide this chat</span>
                        </>
                      )}
                    </button>

                    {activeConversation.isGroup && (
                      <div className="px-3.5 py-2 border-t border-slate-100 dark:border-slate-700 text-[11px] text-slate-500 dark:text-slate-400">
                        <p className="font-semibold text-slate-700 dark:text-slate-300">Group Privacy</p>
                        <p>{activeConversation.isPublic ? '🌐 Public group' : '🔒 Private group'}</p>
                      </div>
                    )}

                    <button
                      onClick={() => {
                        showToast('Chat history cleared');
                        setChatHeaderMenuOpen(false);
                      }}
                      className="w-full px-3.5 py-2 text-left hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center gap-2 border-t border-slate-100 dark:border-slate-700"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Clear messages</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/60 dark:bg-slate-950">
            {/* Participant Profile Banner at Top of Thread */}
            <div className="text-center py-6 border-b border-slate-200/80 dark:border-slate-800 mb-4">
              <img
                src={activeConversation.participant.avatar}
                alt={activeConversation.participant.username}
                className="w-16 h-16 rounded-full object-cover mx-auto mb-2 ring-2 ring-indigo-500/30"
              />
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                {activeConversation.participant.name}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">@{activeConversation.participant.username}</p>
              <div className="flex items-center justify-center gap-2 mt-3">
                <button
                  onClick={() => openUserProfile(activeConversation.participant.id)}
                  className="text-xs font-semibold px-3 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-indigo-400 text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors shadow-xs"
                >
                  View Profile
                </button>
                <span className="text-[11px] text-slate-400 dark:text-slate-500">• Swipe message right to quote</span>
              </div>
            </div>

            {/* Message Stream */}
            {(() => {
              const userMessages = activeConversation.messages.filter(m => m.senderId === currentUser.id);
              const lastUserMessage = userMessages[userMessages.length - 1];

              return (
                <>
                  {activeConversation.messages.map(msg => {
                    const isMe = msg.senderId === currentUser.id;
                    const isLastUserMsg = isMe && lastUserMessage?.id === msg.id;
                    const isSeen = msg.status === 'seen' || Boolean(msg.seenAt) || (activeConversation.lastSeenByRecipient?.messageId === msg.id);
                    const isSelected = selectedMessageId === msg.id;
                    const senderName = isMe ? currentUser.name : activeConversation.participant.name;

                    return (
                      <div
                        key={msg.id}
                        id={`msg-container-${msg.id}`}
                        className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} group`}
                      >
                        {/* Swipeable Message Bubble using Framer Motion */}
                        <motion.div
                          drag="x"
                          dragConstraints={{ left: 0, right: 60 }}
                          dragElastic={0.2}
                          onDragEnd={(_, info) => {
                            if (info.offset.x > 35) {
                              setReplyingTo({
                                id: msg.id,
                                text: msg.isVoice ? '🎙️ Voice note' : msg.mediaUrl ? '📷 Media' : msg.text,
                                senderName
                              });
                              inputRef.current?.focus();
                            }
                          }}
                          className={`flex items-end gap-2 max-w-[85%] sm:max-w-[75%] ${
                            isMe ? 'flex-row-reverse' : 'flex-row'
                          }`}
                        >
                          {!isMe && (
                            <img
                              src={activeConversation.participant.avatar}
                              alt={activeConversation.participant.username}
                              className="w-7 h-7 rounded-full object-cover mb-1 shrink-0 ring-1 ring-slate-200 dark:ring-slate-700"
                            />
                          )}

                          <div
                            onMouseDown={() => handleTouchStart(msg, senderName)}
                            onMouseUp={handleTouchEnd}
                            onTouchStart={() => handleTouchStart(msg, senderName)}
                            onTouchEnd={handleTouchEnd}
                            onClick={() => setSelectedMessageId(isSelected ? null : msg.id)}
                            className={`relative px-4 py-2.5 rounded-2xl text-xs leading-relaxed cursor-pointer transition-all duration-150 ${
                              isMe
                                ? 'bg-indigo-600 text-white rounded-br-xs shadow-xs hover:bg-indigo-700'
                                : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-bl-xs border border-slate-200/90 dark:border-slate-700/80 shadow-xs hover:border-slate-300 dark:hover:border-slate-600'
                            }`}
                          >
                            {/* Quoted Message Card (if this message is a reply) */}
                            {msg.replyTo && (
                              <div className={`mb-2 p-1.5 px-2.5 rounded-lg border-l-2 text-[11px] ${
                                isMe
                                  ? 'bg-indigo-700/60 border-white text-indigo-100'
                                  : 'bg-slate-100 dark:bg-slate-900/80 border-indigo-500 text-slate-700 dark:text-slate-300'
                              }`}>
                                <p className={`font-semibold text-[10px] ${isMe ? 'text-white' : 'text-indigo-600 dark:text-indigo-400'}`}>
                                  {msg.replyTo.senderName}
                                </p>
                                <p className="truncate opacity-90">{msg.replyTo.text}</p>
                              </div>
                            )}

                            {/* Voice Note Bubble */}
                            {msg.isVoice ? (
                              <VoiceNotePlayer
                                durationSeconds={msg.voiceDurationSeconds || 6}
                                isSender={isMe}
                              />
                            ) : msg.mediaUrl ? (
                              /* Media Message */
                              <div className="space-y-1.5 max-w-[280px]">
                                {msg.mediaType === 'video' ? (
                                  <div className="relative rounded-xl overflow-hidden aspect-video border border-slate-200 dark:border-slate-700">
                                    <img src={msg.mediaUrl} alt="Video preview" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                                      <Film className="w-7 h-7 text-white" />
                                    </div>
                                  </div>
                                ) : msg.mediaType === 'file' ? (
                                  <div className={`p-2 rounded-xl border flex items-center gap-2 ${
                                    isMe
                                      ? 'bg-indigo-700/60 border-indigo-500/50'
                                      : 'bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-700'
                                  }`}>
                                    <FileText className={`w-5 h-5 shrink-0 ${isMe ? 'text-indigo-200' : 'text-indigo-600 dark:text-indigo-400'}`} />
                                    <span className="truncate text-[11px] font-medium">{msg.fileName || 'Attached file'}</span>
                                  </div>
                                ) : (
                                  <img
                                    src={msg.mediaUrl}
                                    alt="Shared asset"
                                    className="rounded-xl object-cover max-h-60 w-full border border-slate-200 dark:border-slate-700"
                                  />
                                )}
                                {msg.text && <p className="break-words mt-1">{msg.text}</p>}
                              </div>
                            ) : (
                              /* Regular Text */
                              <p className="break-words">{msg.text}</p>
                            )}

                            {/* Timestamp & Status Icon */}
                            <div
                              className={`text-[9px] mt-1.5 flex items-center justify-end gap-1 ${
                                isMe ? 'text-indigo-200' : 'text-slate-400 dark:text-slate-500'
                              }`}
                            >
                              <span>{msg.timestamp}</span>
                              {isMe && (
                                <span className="inline-flex items-center">
                                  {isSeen ? (
                                    <CheckCheck className="w-3 h-3 text-indigo-100" title="Seen" />
                                  ) : msg.status === 'delivered' ? (
                                    <CheckCheck className="w-3 h-3 text-indigo-300" title="Delivered" />
                                  ) : msg.status === 'sending' ? (
                                    <Clock className="w-2.5 h-2.5 text-indigo-300 animate-spin" title="Sending..." />
                                  ) : (
                                    <Check className="w-3 h-3 text-indigo-300" title="Sent" />
                                  )}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Quick Reply Button (desktop hover or swipe shortcut) */}
                          <button
                            type="button"
                            onClick={() => {
                              setReplyingTo({
                                id: msg.id,
                                text: msg.isVoice ? '🎙️ Voice note' : msg.mediaUrl ? '📷 Media' : msg.text,
                                senderName
                              });
                              inputRef.current?.focus();
                            }}
                            className="opacity-0 group-hover:opacity-100 p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all text-xs"
                            title="Reply to message"
                          >
                            <CornerUpLeft className="w-3.5 h-3.5" />
                          </button>
                        </motion.div>

                        {/* Detailed timestamp sub-label when tapped */}
                        {isSelected && (
                          <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 px-1 flex items-center gap-2 animate-in fade-in duration-150">
                            <span>Sent at {msg.timestamp}</span>
                            {isMe && isSeen && (
                              <span className="text-indigo-600 dark:text-indigo-400 font-medium">
                                • Seen by {activeConversation.participant.name}
                              </span>
                            )}
                            <button
                              type="button"
                              onClick={() => {
                                setReplyingTo({
                                  id: msg.id,
                                  text: msg.isVoice ? '🎙️ Voice note' : msg.mediaUrl ? '📷 Media' : msg.text,
                                  senderName
                                });
                                inputRef.current?.focus();
                              }}
                              className="text-indigo-600 dark:text-indigo-400 hover:underline ml-1"
                            >
                              Quote reply
                            </button>
                          </div>
                        )}

                        {/* Direct Message Visual 'Seen' Indicator on the latest sent message */}
                        {isLastUserMsg && (
                          <div className="mt-1 select-none pr-1">
                            {isSeen ? (
                              <div
                                id={`seen-indicator-${msg.id}`}
                                className="flex items-center justify-end gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 animate-in fade-in duration-200"
                              >
                                <span className="font-normal">
                                  Seen{msg.seenAt ? ` ${msg.seenAt}` : ''}
                                </span>
                                <img
                                  src={activeConversation.participant.avatar}
                                  alt={activeConversation.participant.name}
                                  className="w-3.5 h-3.5 rounded-full object-cover ring-1 ring-indigo-500/40"
                                  title={`Seen by ${activeConversation.participant.name}`}
                                />
                              </div>
                            ) : msg.status === 'delivered' ? (
                              <div
                                id={`delivered-indicator-${msg.id}`}
                                className="flex items-center justify-end gap-1 text-[11px] text-slate-400 dark:text-slate-500 font-normal"
                              >
                                <CheckCheck className="w-3 h-3 text-slate-400 dark:text-slate-500" />
                                <span>Delivered</span>
                              </div>
                            ) : (
                              <div
                                id={`sent-indicator-${msg.id}`}
                                className="flex items-center justify-end gap-1 text-[11px] text-slate-400 dark:text-slate-500 font-normal"
                              >
                                <Check className="w-3 h-3 text-slate-400 dark:text-slate-500" />
                                <span>Sent</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {/* Typing Indicator with 3 animated bouncing dots */}
                  {activeConversation.isTyping && (
                    <div className="flex items-end gap-2 justify-start animate-in fade-in duration-200 pt-1">
                      <img
                        src={activeConversation.participant.avatar}
                        alt={activeConversation.participant.username}
                        className="w-7 h-7 rounded-full object-cover mb-1 shrink-0 ring-1 ring-slate-200 dark:ring-slate-700"
                      />
                      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 px-4 py-2.5 rounded-2xl rounded-bl-xs flex items-center gap-2 shadow-xs">
                        <div className="flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium ml-1">
                          {activeConversation.participant.name} is typing...
                        </span>
                      </div>
                    </div>
                  )}
                </>
              );
            })()}
            <div ref={messagesEndRef} />
          </div>

          {/* Floating Pill Composer Area */}
          <div className="p-3 px-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col gap-2">
            {/* Replying To Quote Banner */}
            <AnimatePresence>
              {replyingTo && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  className="flex items-center justify-between p-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 border-l-4 border-indigo-600 border-y border-r border-slate-200 dark:border-slate-700 text-xs shadow-xs"
                >
                  <div className="flex flex-col min-w-0 pr-2">
                    <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                      Replying to {replyingTo.senderName}
                    </span>
                    <span className="truncate text-slate-700 dark:text-slate-300 text-xs">{replyingTo.text}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setReplyingTo(null)}
                    className="p-1 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* In-Composer Active Voice Recording State */}
            {isRecording ? (
              <div className="flex items-center justify-between gap-3 px-4 py-2.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-indigo-500/50 shadow-md animate-in fade-in duration-150">
                <div className="flex items-center gap-2.5">
                  <span className="w-3 h-3 rounded-full bg-rose-500 animate-ping" />
                  <span className="text-xs font-mono font-bold text-slate-900 dark:text-white">
                    {formatTimer(recordingSeconds)}
                  </span>
                  <div className="flex items-center gap-1 ml-2">
                    <span className="w-1 h-3 rounded-full bg-indigo-600 dark:bg-indigo-400 animate-pulse" />
                    <span className="w-1 h-5 rounded-full bg-indigo-600 dark:bg-indigo-400 animate-pulse" style={{ animationDelay: '100ms' }} />
                    <span className="w-1 h-4 rounded-full bg-indigo-600 dark:bg-indigo-400 animate-pulse" style={{ animationDelay: '200ms' }} />
                    <span className="w-1 h-6 rounded-full bg-indigo-600 dark:bg-indigo-400 animate-pulse" style={{ animationDelay: '150ms' }} />
                    <span className="w-1 h-3 rounded-full bg-indigo-600 dark:bg-indigo-400 animate-pulse" style={{ animationDelay: '50ms' }} />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCancelRecording}
                    className="p-1.5 rounded-full text-slate-500 hover:text-rose-500 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    title="Cancel voice note"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleFinishAndSendVoice}
                    className="px-3.5 py-1.5 rounded-full bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 transition-colors flex items-center gap-1.5 shadow-sm"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Send
                  </button>
                </div>
              </div>
            ) : (
              /* Floating Pill Composer */
              <form
                onSubmit={handleSend}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus-within:border-indigo-500 focus-within:bg-white dark:focus-within:bg-slate-800 shadow-sm transition-all"
              >
                {/* Media Attachment Picker */}
                <button
                  type="button"
                  onClick={() => setShowMediaModal(true)}
                  className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors rounded-full hover:bg-slate-200 dark:hover:bg-slate-700"
                  title="Share photo, video, or document"
                >
                  <ImageIcon className="w-4 h-4" />
                </button>

                {/* Direct Message Input */}
                <input
                  ref={inputRef}
                  id="direct-message-input"
                  type="text"
                  value={inputText}
                  onChange={e => setInputText(e.target.value)}
                  placeholder={`Message ${activeConversation.participant.name}...`}
                  className="flex-1 bg-transparent px-2 py-1 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none"
                />

                {/* Right controls: Mic / Send / Heart */}
                {inputText.trim() ? (
                  <button
                    id="direct-message-send-btn"
                    type="submit"
                    className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center hover:bg-indigo-700 active:scale-95 transition-transform shadow-xs"
                    title="Send message"
                  >
                    <Send className="w-3.5 h-3.5 fill-current ml-0.5" />
                  </button>
                ) : (
                  <div className="flex items-center gap-1">
                    {/* Voice Note Record Button */}
                    <button
                      type="button"
                      onClick={handleStartRecording}
                      className="p-1.5 rounded-full text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                      title="Record Voice Note"
                    >
                      <Mic className="w-4 h-4" />
                    </button>

                    {/* Quick Heart Reaction */}
                    <button
                      type="button"
                      onClick={handleSendHeart}
                      className="p-1.5 rounded-full text-rose-500 hover:scale-110 active:scale-95 transition-transform"
                      title="Send heart"
                    >
                      <Heart className="w-4 h-4 fill-rose-500" />
                    </button>
                  </div>
                )}
              </form>
            )}
          </div>
        </div>
      ) : (
        <div className="flex-1 hidden md:flex items-center justify-center text-slate-400 dark:text-slate-500 flex-col gap-2 bg-slate-50/50 dark:bg-slate-900/50">
          <p className="text-xs">Select a conversation to start chatting</p>
          <button
            onClick={() => setShowNewChatModal(true)}
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            + New Message
          </button>
        </div>
      )}

      {/* Media Attachment Modal */}
      {showMediaModal && activeConversation && (
        <MediaAttachmentModal
          isOpen={showMediaModal}
          onClose={() => setShowMediaModal(false)}
          onSend={handleSendMedia}
          recipientName={activeConversation.participant.name}
        />
      )}

      {/* New Chat / User Search & Group Creation Modal */}
      {showNewChatModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            {/* Modal Header */}
            <div className="p-3.5 px-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setNewChatTab('direct')}
                  className={`text-xs font-bold px-3 py-1 rounded-lg transition-colors ${
                    newChatTab === 'direct'
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Direct Message
                </button>
                <button
                  onClick={() => setNewChatTab('group')}
                  className={`text-xs font-bold px-3 py-1 rounded-lg transition-colors flex items-center gap-1.5 ${
                    newChatTab === 'group'
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>New Group</span>
                </button>
              </div>

              <button
                onClick={() => {
                  setShowNewChatModal(false);
                  setUserSearchQuery('');
                  setGroupName('');
                  setSelectedGroupMembers([]);
                }}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-white p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {newChatTab === 'direct' ? (
              <>
                {/* Search Input */}
                <div className="p-3 border-b border-slate-200 dark:border-slate-800">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                    <input
                      type="text"
                      autoFocus
                      value={userSearchQuery}
                      onChange={e => setUserSearchQuery(e.target.value)}
                      placeholder="Search user by name or @username..."
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                {/* User List */}
                <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60 p-1">
                  {searchableUsers.length > 0 ? (
                    searchableUsers.map(user => (
                      <div
                        key={user.id}
                        onClick={() => handleStartNewChat(user)}
                        className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/60 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={user.avatar}
                            alt={user.username}
                            className="w-10 h-10 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                          />
                          <div>
                            <p className="text-xs font-semibold text-slate-900 dark:text-white">
                              {user.name}
                            </p>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400">
                              @{user.username}
                            </p>
                          </div>
                        </div>
                        <button
                          className="text-xs font-bold px-3 py-1.5 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-xs"
                        >
                          Chat
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center text-xs text-slate-400 dark:text-slate-500">
                      No users found matching "{userSearchQuery}"
                    </div>
                  )}
                </div>
              </>
            ) : (
              /* Group Chat Creation View */
              <div className="p-4 space-y-4 flex-1 overflow-y-auto">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Group Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={groupName}
                    onChange={e => setGroupName(e.target.value)}
                    placeholder="e.g. Street Photographers Guild, Studio Team..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Group Privacy
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setGroupIsPublic(true)}
                      className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition-all ${
                        groupIsPublic
                          ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-100'
                          : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <Globe className="w-4 h-4 text-emerald-500" />
                      <div>
                        <p className="text-xs font-bold">Public Group</p>
                        <p className="text-[10px] text-slate-500">Anyone can find and chat</p>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setGroupIsPublic(false)}
                      className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition-all ${
                        !groupIsPublic
                          ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-100'
                          : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <Lock className="w-4 h-4 text-amber-500" />
                      <div>
                        <p className="text-xs font-bold">Private Group</p>
                        <p className="text-[10px] text-slate-500">Invited members only</p>
                      </div>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Select Members ({selectedGroupMembers.length} selected)
                  </label>
                  <div className="max-h-48 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 p-1">
                    {allUsers
                      .filter(u => u.id !== currentUser.id)
                      .map(user => {
                        const isSelected = selectedGroupMembers.includes(user.id);
                        return (
                          <div
                            key={user.id}
                            onClick={() => {
                              setSelectedGroupMembers(prev =>
                                isSelected
                                  ? prev.filter(id => id !== user.id)
                                  : [...prev, user.id]
                              );
                            }}
                            className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/60 cursor-pointer transition-colors"
                          >
                            <div className="flex items-center gap-2.5">
                              <img
                                src={user.avatar}
                                alt={user.username}
                                className="w-7 h-7 rounded-full object-cover"
                              />
                              <span className="text-xs font-medium text-slate-800 dark:text-slate-200">
                                {user.name} (@{user.username})
                              </span>
                            </div>
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => {}}
                              className="accent-indigo-600 w-4 h-4 rounded"
                            />
                          </div>
                        );
                      })}
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-200 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setShowNewChatModal(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={!groupName.trim()}
                    onClick={() => {
                      if (!groupName.trim()) return;
                      createGroupChat(groupName.trim(), groupIsPublic, selectedGroupMembers);
                      setShowNewChatModal(false);
                      setGroupName('');
                      setSelectedGroupMembers([]);
                    }}
                    className="px-5 py-2 rounded-xl bg-indigo-600 disabled:opacity-50 text-white font-bold text-xs hover:bg-indigo-700 transition-colors shadow-sm"
                  >
                    Create Group Chat
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Secret Code Configuration Modal */}
      {showSecretCodeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
                <Key className="w-5 h-5" />
              </span>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Hidden Chat Secret Code</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Type this exact code into the Messages search bar to unlock hidden chats and stories
                </p>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Current Secret Unlock Code
                </label>
                <input
                  type="text"
                  value={newSecretCodeInput}
                  onChange={e => setNewSecretCodeInput(e.target.value)}
                  placeholder="e.g. 1234 or mysecretpass"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white font-mono placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-[11px] text-slate-600 dark:text-slate-400 space-y-1">
                <p className="font-semibold text-slate-800 dark:text-slate-200">How hidden chats work:</p>
                <p>• Use the 3-dot menu on any chat to click "Hide Chat".</p>
                <p>• It vanishes completely from your regular conversation list.</p>
                <p>• Type your secret code (currently <strong className="text-indigo-600 dark:text-indigo-400 font-mono">{chatSecretCode || '1234'}</strong>) in the search bar to reveal the Locked Chats column.</p>
                <p>• Stories from hidden contacts will only appear inside that locked column.</p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setShowSecretCodeModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  if (newSecretCodeInput.trim()) {
                    setChatSecretCode(newSecretCodeInput.trim());
                    showToast(`Secret code updated to: "${newSecretCodeInput.trim()}"`);
                    setShowSecretCodeModal(false);
                  }
                }}
                className="px-5 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700"
              >
                Save Secret Code
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
