import React, { useState, useEffect } from "react";
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  Trash2,
  ArrowLeft,
  Sparkles,
  Brain,
} from "lucide-react";
import toast from "react-hot-toast";
import moment from "moment";
import flashcardService from "../../services/flashcardService";
import aiService from "../../services/aiService";
import Spinner from "../common/Spinner";
import Modal from "../common/Modal";
import Flashcard from './Flashcard'
const FlashcardManager = ({ documentId }) => {
  const [flashcardSets, setFlashcardSets] = useState([]);
  const [selectedSet, setSelectedSet] = useState(null);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [setToDelete, setSetToDelete] = useState(null);

  const fetchFlashcardSets = async () => {
    setLoading(true);
    try {
      const response =
        await flashcardService.getFlashcardsForDocument(documentId);
      setFlashcardSets(response.data);
    } catch (error) {
      toast.error("Failed to fetch flashcard sets.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (documentId) {
      fetchFlashcardSets();
    }
  }, [documentId]);

  const handleGenerateFlashcards = async () => {
    setGenerating(true);
    try {
      await aiService.generateFlashcards(documentId);
      toast.success("Flashcards generated successfully!");
      fetchFlashcardSets();
    } catch (error) {
      toast.error(error.message || "Failed to generate flashcards.");
    } finally {
      setGenerating(false);
    }
  };
  const handleNextCard = () => {
    if (selectedSet) {
      handleReview(currentCardIndex);
      setCurrentCardIndex(
        (prevIndex) => (prevIndex + 1) % selectedSet.cards.length,
      );
    }
  };

  const handlePrevCard = () => {
    if (selectedSet) {
      handleReview(currentCardIndex);
      setCurrentCardIndex(
        (prevIndex) =>
          (prevIndex - 1 + selectedSet.cards.length) % selectedSet.cards.length,
      );
    }
  };
  const handleReview = async (index) => {
    const currentCard = selectedSet?.cards[currentCardIndex];
    if (!currentCard) return;
    try {
      await flashcardService.reviewFlashcard(currentCard._id, index);
      toast.success("Flashcard reviewed!");
    } catch (error) {
      toast.error("Failed to review flashcard.");
      console.error(error);
    }
  };
  const handleToggleStar = async (cardId) => {
    try {
      await flashcardService.toggleStar(cardId);
      const updatedSets = flashcardSets.map((set) => {
        if (set._id === selectedSet._id) {
          const updatedSets = set.cards.map((card) =>
            card._id === cardId ? { ...card, isStarred: !card.isStarred } : card
          );
          return { ...set, cards: updatedSets };
        }
        return set;
      });
      setFlashcardSets(updatedSets);
      setSelectedSet(updatedSets.find((set) => set._id === selectedSet._id));
      toast.success("Flashcard starred status updated!");
    } catch (error) {
      toast.error("Failed to update star status.");
      console.error(error);
    }
  }

  const handleDeleteRequest = (e, set) => {
    e.stopPropagation();
    setSetToDelete(set);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!setToDelete) return;
    setDeleting(true);
    try {
      await flashcardService.deleteFlashcardSet(setToDelete._id);
      toast.success("Flashcard set deleted successfully!");
      setIsDeleteModalOpen(false);
      setSetToDelete(null);
      fetchFlashcardSets();
    } catch (error) {
      toast.error(error.message || "Failed to delete flashcard set.");
    } finally {
      setDeleting(false);
    }
  };

  const handleSelectSet = (set) => {
    setSelectedSet(set);
    setCurrentCardIndex(0);
  };

  const renderFlashcardViewer = () => {
    const currentCard = selectedSet.cards[currentCardIndex];

    return (
      <div className="space-y-8">
        {/*Back Button*/}
        <button
          onClick={() => setSelectedSet(null)}
          className="group inline-flex items-center gap-2 text-sm font-medium text-black hover:underline transition-colors duration-150"
        >
          <ArrowLeft
            className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200"
            strokeWidth={2}
          />
          Back to Sets
        </button>

        {/*Flashcard Display*/}
        <div className="flex flex-col items-center space-y-8">
          <div className="w-full max-w-2xl">
            <Flashcard
              flashcard={currentCard}
              onToggleStar={handleToggleStar}
            />
          </div>

          {/*Navigation Controls*/}
          <div className="flex items-center gap-6">
            <button
              onClick={handlePrevCard}
              disabled={selectedSet.cards.length <= 1}
              className="group flex items-center gap-2 px-5 h-11 bg-white text-black font-medium text-sm rounded-sm border-2 border-black shadow-[3px_3px_0px_#000] transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft
                className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform duration-200"
                strokeWidth={2.5} />
              Previous
            </button>

            <div className="px-4 py-2 bg-white rounded-sm border-2 border-black">
              <span className="text-sm font-semibold text-black">
                {currentCardIndex + 1} <span className="text-slate-400 font-normal"></span>{" "}
                {selectedSet.cards.length}
              </span>
            </div>

            <button
              onClick={handleNextCard}
              disabled={selectedSet.cards.length <= 1}
              className="group flex items-center gap-2 px-5 h-11 bg-white text-black font-medium text-sm rounded-sm border-2 border-black shadow-[3px_3px_0px_#000] transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderSetList = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-20">
          <Spinner />
        </div>
      );
    }

    if (flashcardSets.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-16 px-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-sm bg-[#ffd400] border-2 border-black shadow-[3px_3px_0px_#000] mb-6">
            <Brain className="w-8 h-8 text-black" strokeWidth={2} />
          </div>
          <h3 className="text-xl font-semibold text-black mb-2">
            No Flashcards Yet
          </h3>
          <p className="text-sm text-neutral-700 mb-8 text-center max-w-sm">
            Generate flashcards from your document to start learning and
            reinforce your knowledge.
          </p>
          <button
            onClick={handleGenerateFlashcards}
            disabled={generating}
            className="group inline-flex items-center gap-2 px-6 h-12 bg-[#ffd400] text-black font-semibold text-sm rounded-sm border-2 border-black shadow-[4px_4px_0px_#000] transition-all duration-150 active:translate-x-0.5 active:translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {generating ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Generating...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" strokeWidth={2} />
                <span>Generate Flashcards</span>
              </>
            )}
          </button>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-black">
              Your Flashcard Sets
            </h3>
            <p className="text-sm text-neutral-700 mt-1">
              {flashcardSets.length}{" "}
              {flashcardSets.length === 1 ? "set" : "sets"} available
            </p>
          </div>
          <button
            onClick={handleGenerateFlashcards}
            disabled={generating}
            className="group inline-flex items-center gap-2 px-5 h-11 bg-black text-[#f6f3ea] font-semibold text-sm rounded-sm border-2 border-black shadow-[3px_3px_0px_#000] transition-all duration-150 active:translate-x-0.5 active:translate-y-0.5 disabled-opacity-50 disabled:cursor-not-allowed"
          >
            {generating ? (
              <>
                {/* The spinner is now empty and self-closing */}
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                {/* The text is a sibling, so it stays still */}
                <span>Generating...</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" strokeWidth={2.5} />
                Generate New Set
              </>
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {flashcardSets.map((set) => (
            <div
              key={set._id}
              onClick={() => handleSelectSet(set)}
              className="group relative bg-[#f7f2e8] border-2 border-black rounded-sm p-6 cursor-pointer shadow-[4px_4px_0px_#000] transition-all duration-150"
            >
              <button
                onClick={(e) => handleDeleteRequest(e, set)}
                className="absolute top-4 right-4 p-2 text-black hover:bg-[#ff5c5c] border-2 border-black rounded-sm transition-all duration-150 opacity-0 group-hover:opacity-100"
              >
                <Trash2 className="w-4 h-4" strokeWidth={2} />
              </button>

              <div className="space-y-4">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-sm bg-[#ffd400] border-2 border-black">
                  <Brain
                    className="w-6 h-6 text-black"
                    strokeWidth={2}
                  ></Brain>
                </div>
                <div>
                  <h4 className="text-base font-semibold text-black mb-1">
                    Flashcard Set
                  </h4>
                  <p className="text-xs font-medium text-neutral-700 uppercase tracking-wide">
                    Created {moment(set.createdAt).format("MM, DD, YYYY")}
                  </p>
                </div>
                <div className="flex items-center gap-2 pt-2 border-t-2 border-black">
                  <div className="px-3 py-1.5 bg-black border-2 border-black rounded-sm">
                    <span className="text-sm font-semibold text-[#f6f3ea]">
                      {set.cards.length}{" "}
                      {set.cards.length === 1 ? "card" : "cards"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="bg-[#f7f2e8] border-2 border-black rounded-sm shadow-[4px_4px_0px_#000] p-8">
        {selectedSet ? renderFlashcardViewer() : renderSetList()}
      </div>

      {/*Delete Confirmation Modal*/}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Flashcard Set?"
      >
        <div className="space-y-6">
          <p className="text-sm text-neutral-700">
            Are you sure you want to delete this flashcard set? This action
            cannot be undone and all cards will be permanently removed.
          </p>
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsDeleteModalOpen(false)}
              disabled={deleting}
              className="px-5 h-11 bg-white text-black font-medium text-sm rounded-sm border-2 border-black shadow-[3px_3px_0px_#000] transition-all duration-150 disabled-opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmDelete}
              disabled={deleting}
              className="px-5 h-11 bg-black text-[#f6f3ea] font-semibold text-sm rounded-sm border-2 border-black shadow-[3px_3px_0px_#000] transition-all duration-150 active:translate-x-0.5 active:translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {deleting ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Deleting...
                </span>
              ) : (
                "Delete Set"
              )}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default FlashcardManager;
