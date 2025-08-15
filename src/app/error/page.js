import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function Error(){
    return(
        <section className="position-relative bg-soft-primary">
            <div className="container">
                <div className="row">
                    <div className="col-12 p-0">
                        <div className="d-flex flex-column min-vh-100 justify-content-center px-md-5 py-5 px-4">
                            <div className="text-center">
                                <Link href="/"><Image src="/images/logo-icon-64.png" width={64} height={64} alt=""/></Link>
                            </div>
                            <div className="title-heading text-center my-auto">
                                <Image src="/images/error.png" width={200} height={200} className="img-fluid" alt=""/>
                                <h1 className="mb-3 mt-5 text-dark">Page Not Found?</h1>
                                <p className="text-muted">Whoops, this is embarassing. <br/> Looks like the page you were looking for wasnt found.</p>
                                
                                <div className="mt-4">
                                    <Link href="/" className="btn btn-primary">Back to Home</Link>
                                </div>
                            </div>
                            <div className="text-center">
                                <p className="mb-0 text-muted">© {new Date().getFullYear()}Towntor. Design & Develop with <i className="mdi mdi-heart text-danger"></i> by <Link href="https://shreethemes.in/" target="_blank" className="text-reset">Shreethemes</Link>.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}