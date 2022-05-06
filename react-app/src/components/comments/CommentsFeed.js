import { React, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { grabComments } from "../../store/comments";
import { editComment } from "../../store/comments";
import CommentContainer from "./CommentContainer";

const CommentsFeed = ({ photo }) => {
	const dispatch = useDispatch();

	const comments = useSelector(state => Object.values(state.comments))

	useEffect(() => {
		dispatch(grabComments(photo.id))
	}, [dispatch])

	return (
		<div>
			{comments.length > 0 &&
				<>
					<h1>Comments feed</h1>
					<ul>
						{comments.map(comment => {
							if (comment.photo_id === photo.id) {
								return (
									<li key={comment.id}>
										<CommentContainer comment={comment} />
									</li>
								)
							}
						}
						)}
					</ul>
				</>
			}
		</div>
	)
}

export default CommentsFeed
