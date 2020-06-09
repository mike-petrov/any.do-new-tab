import React from 'react';
import svgFolder from '../img/folder.svg';


export const Bookmark = ({ bookmarkFolder }) => (
	<>
		{bookmarkFolder.children ? (
			<div className="bookmarks_folder" key={bookmarkFolder.id}>
				<img src={svgFolder} alt="folder" />
				{bookmarkFolder.title}
				{bookmarkFolder.children && (
					<div className="folder_content">
						{bookmarkFolder.children.map((bookmark) => (
							<>
								<Bookmark bookmarkFolder={bookmark} />
							</>
						))}
					</div>
				)}
			</div>
		) : (
			<a href={bookmarkFolder.url} className="bookmark_single" key={bookmarkFolder.id}>
				<img
					src={`https://www.google.com/s2/favicons?domain=${bookmarkFolder.url}`}
					alt="favicon"
					style={bookmarkFolder.title.length !== 0 ? { marginRight: '8px' } : {}}
				/>
				<span>{bookmarkFolder.title}</span>
			</a>
		)}
	</>
);
