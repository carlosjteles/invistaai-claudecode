"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";

import { FiSearch } from "../assets/icons/vander";

export default function Navbar({
	navClass,
	logolight,
	menuClass,
	currentPath,
}) {
	let [scroll, setScroll] = useState(false);
	let [isMenu, setisMenu] = useState(false);
	let [modal, setModal] = useState(false);
	const dropdownRef = useRef(null);

	useEffect(() => {
		function closeDropdown(event) {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
				setModal(false);
			}
		}

		document.addEventListener("mousedown", closeDropdown);

		return () => {
			document.removeEventListener("mousedown", closeDropdown);
		};
	}, []);

	useEffect(() => {
		function activateMenu() {
			const activeOldMenu = document.querySelectorAll(
				".navigation-menu .active"
			);

			if (activeOldMenu.length) {
				activeOldMenu.forEach((item) => {
					item.classList.remove("active");
				});
			}

			const menuItems = document.getElementsByClassName("sub-menu-item");

			if (menuItems) {
				let matchingMenuItem = null;
				for (let idx = 0; idx < menuItems.length; idx++) {
					const urlWithoutParams = window.location.href.split("?")[0];

					if (menuItems[idx].href === urlWithoutParams) {
						matchingMenuItem = menuItems[idx];
					}
				}

				if (matchingMenuItem) {
					matchingMenuItem.classList.add("active");

					let immediateParent = getClosest(matchingMenuItem, "li");

					if (immediateParent) {
						immediateParent.classList.add("active");
					}

					let parent = getClosest(immediateParent, ".child-menu-item");
					if (parent) {
						parent.classList.add("active");
					}

					parent = getClosest(parent || immediateParent, ".parent-menu-item");

					if (parent) {
						parent.classList.add("active");

						let parentMenuitem = parent.querySelector(".menu-item");
						if (parentMenuitem) {
							parentMenuitem.classList.add("active");
						}

						let parentOfParent = getClosest(parent, ".parent-parent-menu-item");
						if (parentOfParent) {
							parentOfParent.classList.add("active");
						}
					} else {
						let parentOfParent = getClosest(
							matchingMenuItem,
							".parent-parent-menu-item"
						);
						if (parentOfParent) {
							parentOfParent.classList.add("active");
						}
					}
				}
			}
		}

		activateMenu();

		window.addEventListener("scroll", () => {
			setScroll(window.scrollY > 50);
		});

		window.scrollTo(0, 0);
	}, [currentPath]);

	const toggleMenu = () => {
		setisMenu(!isMenu);
		if (document.getElementById("navigation")) {
			const anchorArray = Array.from(
				document.getElementById("navigation").getElementsByTagName("a")
			);
			anchorArray.forEach((element) => {
				element.addEventListener("click", (elem) => {
					const target = elem.target.getAttribute("href");
					if (target !== "") {
						if (elem.target.nextElementSibling) {
							var submenu = elem.target.nextElementSibling.nextElementSibling;
							submenu.classList.toggle("open");
						}
					}
				});
			});
		}
	};
	function getClosest(elem, selector) {
		if (!Element.prototype.matches) {
			Element.prototype.matches =
				Element.prototype.matchesSelector ||
				Element.prototype.mozMatchesSelector ||
				Element.prototype.msMatchesSelector ||
				Element.prototype.oMatchesSelector ||
				Element.prototype.webkitMatchesSelector ||
				function (s) {
					var matches = (this.document || this.ownerDocument).querySelectorAll(
							s
						),
						i = matches.length;
					while (--i >= 0 && matches.item(i) !== this) {}
					return i > -1;
				};
		}

		for (; elem && elem !== document; elem = elem.parentNode) {
			if (elem.matches(selector)) return elem;
		}
		return null;
	}

	return (
		<>
			<header
				id="topnav"
				className={`${scroll ? "nav-sticky" : ""} ${navClass}`}
			>
				<div className="container">
					{logolight === true ? (
						<Link className="logo" href="/">
							<span className="logo-light-mode">
								<Image
									src="/images/logo-dark.png"
									width={132}
									height={32}
									className="l-dark"
									alt=""
								/>
								<Image
									src="/images/logo-light.png"
									width={132}
									height={32}
									className="l-light"
									alt=""
								/>
							</span>
							<Image
								src="/images/logo-light.png"
								width={132}
								height={32}
								className="logo-dark-mode"
								alt=""
							/>
						</Link>
					) : (
						<Link className="logo" href="/">
							<Image
								src="/images/logo-dark.png"
								width={132}
								height={32}
								className="logo-light-mode"
								alt=""
							/>
							<Image
								src="/images/logo-light.png"
								width={132}
								height={32}
								className="logo-dark-mode"
								alt=""
							/>
						</Link>
					)}

					<div className="menu-extras">
						<div className="menu-item">
							<Link
								href="#"
								className={`navbar-toggle ${isMenu ? "open" : ""}`}
								id="isToggle"
								onClick={() => toggleMenu()}
							>
								<div className="lines">
									<span></span>
									<span></span>
									<span></span>
								</div>
							</Link>
						</div>
					</div>

					<ul className="buy-button list-inline mb-0">
						<li className="list-inline-item ps-1 mb-0">
							<div className="dropdown" ref={dropdownRef}>
								<button
									type="button"
									className="dropdown-toggle btn btn-sm btn-icon btn-pills btn-primary"
									onClick={() => setModal(!modal)}
								>
									<FiSearch className="icons" />
								</button>
								<div
									className={`${
										modal === true ? "show" : ""
									} dropdown-menu dd-menu dropdown-menu-start bg-white rounded-3 border-0 mt-3 p-0 right-0`}
									style={{ width: "240px", right: "0" }}
								>
									<div className="search-bar">
										<div id="itemSearch" className="menu-search mb-0">
											<form
												role="search"
												method="get"
												id="searchItemform"
												className="searchform"
											>
												<input
													type="text"
													className="form-control rounded-3 border"
													name="s"
													id="searchItem"
													placeholder="Procurar..."
												/>
												<input
													type="submit"
													id="searchItemsubmit"
													value="Procurar"
												/>
											</form>
										</div>
									</div>
								</div>
							</div>
						</li>
					</ul>

					<div id="navigation" style={{ display: isMenu ? "block" : "none" }}>
						<ul className={menuClass}>
							<li>
								<Link href="/" className="sub-menu-item">
									Home
								</Link>
							</li>

							<li>
								<Link href="/imoveis" className="sub-menu-item">
									Venda
								</Link>
							</li>

							<li>
								<Link href="/lancamentos" className="sub-menu-item">
									Lançamentos
								</Link>
							</li>

							<li>
								<Link href="/blogs" className="sub-menu-item">
									Notícias
								</Link>
							</li>

							<li>
								<Link href="/contato" className="sub-menu-item">
									Contato
								</Link>
							</li>
						</ul>
					</div>
				</div>
			</header>
		</>
	);
}
