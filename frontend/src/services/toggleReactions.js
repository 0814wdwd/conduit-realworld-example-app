import axios from "axios";
import errorHandler from "../helpers/errorHandler";

async function toggleReactions({ slug, headers, ...payload }) {
  try {
    const { data } = await axios({
      headers,
      method: "POST",
      url: `api/articles/${slug}/reactions`,
      data: payload,
    });
    return data;
  } catch (error) {
    errorHandler(error);
  }
}

export default toggleReactions;
