import { create } from "zustand";
import zukeeper from "zukeeper";
import { persist, createJSONStorage } from "zustand/middleware";
import { StateStorage } from "zustand/middleware";
import axios from "axios";
import { use } from "react";
import { baseUrl } from "./App";
import { axiosInstance } from "./utils/axiosHandler";

const useJLStore = create(
  persist(
    (set, get) => ({
      zUser: {
        // id: 9999,
        // name: "Test User",
        // email: "test@user.com",
        // imageUrl:
        //   "httpss://ui-avatars.com/api/?name=Test+User&size=300&background=random&color=random&length=2",
        // linkedinId: "notarealuser",
        // token: "thisisafaketokenforthetestuser",
      },
      setZUser: (user) => set(() => ({ zUser: user })),
      localUserJobs: [],
      setLocalUserJobs: async () => {
        try {
          const response = await axios.get(
            `${baseUrl}/jobs/user/${get().zUser.id}`,
            {
              "content-type": "application/json",
              // headers: {
              //   Authorization: "Bearer " + get().zUser.token,
              // },
            }
          );
          set({ localUserJobs: response.data[0].id ? response.data : [] });
        } catch (error) {
          console.error("Error fetching your jobs:", error);
          console.error("Token:", get().zUser.token);
        }
      },

      zJobs: [
        // {
        //   id: 1,
        //   jobTitle: "Test Job",
        //   company: "JobdLink",
        //   description: "A job application tracker.",
        //   caption: "Test Caption",
        //   jobUrl: "https://jobd.link",
        //   userId: 9999,
        //   createdAt: "2021-09-01T00:00:00.000Z",
        //   updatedAt: "2021-09-01T00:00:00.000Z",
        //   private: 0,
        //   count_likes: 0,
        //   count_comments: 0,
        //   status: "Applied",
        //   location: "Test",
        //   username: "Test User",
        //   name: "Test User",
        //   imageUrl: "https://eu.ui-avatars.com/api/?name=Jobd+Link&size=250",
        // },
      ],
      setZJobs: async () => {
        try {
          const response = await axios.get(`${baseUrl}/jobs/`, {
            "content-type": "application/json",
            headers: {
              Authorization: "Bearer " + get().zUser.token,
            },
          });
          set({ zJobs: response.data[0].id ? response.data : [] });
        } catch (error) {
          console.error("Error fetching jobs:", error);
          console.error("Token:", get().zUser.token);
        }
      },

      // zJobComments: [],
      // setZJobComments: async (jobId) => {
      //   try {
      //     const response = await axios.get(`${baseUrl}/jobComment/${jobId}`);
      //     set({ zJobComments: response.data[0].id ? response.data : [] });
      //   } catch (error) {
      //     console.log("Error fetching comments:", error);
      //   }
      // },
      // addZJobComment: (jobComment) =>
      //   set((state) => ({ zJobComments: [jobComment, ...state.zJobComments] })),
      // removeZJobComment: (id) =>
      //   set((state) => ({
      //     zJobComments: [
      //       ...state.zJobComments.filter((jobComment) => jobComment.id !== id),
      //     ],
      //   })),
      // updateZJobComment: (id, comment) =>
      //   set((state) => ({
      //     zJobComments: [
      //       ...state.zJobComments.map((jobComment) => {
      //         if (jobComment.id === id) {
      //           return { ...jobComment, comment };
      //         }
      //         return jobComment;
      //       }),
      //     ],
      //   })),
      zJobLikes: [],
      setZJobLikes: (jobLikes) => set({ zJobLikes: jobLikes }),
      addZJobLike: (jobLike) =>
        set((state) => ({ zJobLikes: [...state.zJobLikes, jobLike] })),
      removeZJobLike: (id) =>
        set((state) => ({
          zJobLikes: [
            ...state.zJobLikes.filter((jobLike) => jobLike.id !== id),
          ],
        })),
      zJobLikesUsernames: [],
      setZJobLikesUsernames: async (jobId) => {
        try {
          const response = await axios.get(
            `${baseUrl}/jobLike/${jobId}/usernames`
          );
          console.log("Usernames:", response.data);
          set({ zJobLikesUsernames: response.data });
        } catch (error) {
          console.error("Error fetching usernames:", error);
        }
      },
      toggleJobdLink: async (jobId) => {
        try {
          await axiosInstance.put(`${baseUrl}/jobs/toggle/${jobId}`);

          get().setZJobs();
          get().setLocalUserJobs();
        } catch (error) {
          console.error("Error toggling job:", error);
        }
      },
      activeProfile: {},
      setActiveProfile: async (user_id) => {
        try {
          const response = await axiosInstance.get(
            `${baseUrl}/profile/${user_id}`
          );
          set({ activeProfile: response.data });
        } catch (error) {
          console.error("Error fetching profile:", error);
        }
      },
      toggleProfilePartial: async (user_id) => {
        try {
          await axios.put(`${baseUrl}/profile/toggle/${user_id}`);
          get().setZProfile(user_id);
        } catch (error) {
          console.error("Error toggling profile:", error);
        }
      },
      // zGuestProfile: {},
      // setZGuestProfile: async (id) => {
      //   try {
      //     const response = await axios.get(`${baseUrl}/user/${id}`);
      //     set({ zGuestProfile: response.data });
      //   } catch (error) {
      //     console.error("Error fetching guest user:", error);
      //   }
      // },
      jobSearchQuery: "",
      updateJobSearchQuery: (query) =>
        set((state) => ({ jobSearchQuery: query })),
    }),
    {
      name: "JLstorage", // name of the item in the storage (must be unique)
      onRehydrateStorage: () => (state) => {
        console.log("Rehydrating state:", state);
      },
    }
  )
);

// const useSearchStore = create(
//   zukeeper((set) => ({
//     jobSearchQuery: "",
//     updateJobSearchQuery: (query) => set(() => ({ jobSearchQuery: query })),
//   }))
// );

//window.store = useJLStore;
export default useJLStore;
